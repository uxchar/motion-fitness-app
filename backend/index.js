require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const Pool = require("pg").Pool;
// const validateToken = require("./middleware/authmiddleware");
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon SSL connections
  },
});

const corsOptions = {
  origins: ["motion-fitness-app.vercel.app"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// Login Route
app.post("${API_BASE_URL}/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(user);
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Error during login. Please try again later." });
  }
});

//Register Route
app.post("${API_BASE_URL}/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password)  VALUES ($1, $2, $3)",
      [name, email, password]
    );

    res.json("User registered successfully");
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Error during registration. Please try again later." });
  }
});

// External API Data Fetch
app.get("${API_BASE_URL}/api/data", async (req, res) => {
  try {
    const https = require("https");

    const response = await axios.get(
      "https://exercisedb.p.rapidapi.com/exercises?limit=1000&offset=0",
      {
        headers: {
          "x-rapidapi-key": `${API_KEY}`,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Disable SSL verification, was not working when I trid without this
        }),
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error fetching data from external API" });
  }
});

//Get previous workout data request
app.get("${API_BASE_URL}/workouts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
      workouts.start,
      workouts.finish,
      workouts.id AS workout_id,
      workout_exercises.exercise_name,
      exercise_sets.set_number,
      exercise_sets.reps,
      exercise_sets.weight,
      exercise_sets.complete
    FROM 
      workouts
    JOIN 
      workout_exercises ON workouts.id = workout_exercises.workout_id
    JOIN 
      exercise_sets ON workout_exercises.id = exercise_sets.workout_exercise_id
    WHERE 
      workouts.user_id = $1
    ORDER BY 
      workout_id, workout_exercises.exercise_name, exercise_sets.set_number;
    `,
      [userId]
    );

    const favoriteExerciseResult = await pool.query(
      `
      SELECT exercise_name, COUNT(*) AS exercise_count
      FROM workout_exercises
      WHERE workout_exercises.workout_id IN (
        SELECT id FROM workouts WHERE user_id = $1
      )
      GROUP BY exercise_name
      ORDER BY exercise_count DESC
      LIMIT 1;
      `,
      [userId]
    );

    const favoriteExercise = favoriteExerciseResult.rows[0];

    const workouts = [];

    //Group data for each workout instead sending each exercise and individual set
    result.rows.forEach((row) => {
      let workout = workouts.find(
        (workoutItem) => workoutItem.workout_id === row.workout_id
      );

      if (!workout) {
        workout = {
          workout_id: row.workout_id,
          start: row.start,
          finish: row.finish,
          exercises: [],
        };

        workouts.push(workout);
      }

      let exercise = workout.exercises.find(
        (exerciseItem) => exerciseItem.exercise_name === row.exercise_name
      );

      if (!exercise) {
        exercise = {
          exercise_name: row.exercise_name,
          sets: [],
        };
        workout.exercises.push(exercise);
      }

      exercise.sets.push({
        set_number: row.set_number,
        reps: row.reps,
        weight: row.weight,
        complete: row.complete,
      });
    });

    res.json({ workouts, favoriteExercise: favoriteExercise });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

//Insert finished workout into the database
app.post("${API_BASE_URL}/workout/:userId", async function (req, res) {
  const { userId } = req.params;
  const { exercises, startTime, finishTime } = req.body;

  try {
    const workoutResult = await pool.query(
      "INSERT INTO workouts(user_id, start, finish) VALUES ($1, $2, $3) RETURNING id",
      [userId, startTime, finishTime]
    );
    const workoutId = workoutResult.rows[0].id;

    for (const exercise of exercises) {
      const exerciseResult = await pool.query(
        "INSERT INTO workout_exercises(workout_id, exercise_name) VALUES ($1, $2) RETURNING id",
        [workoutId, exercise.name]
      );

      const exerciseId = exerciseResult.rows[0].id;

      for (const set of exercise.sets) {
        await pool.query(
          "INSERT INTO exercise_sets(workout_exercise_id, set_number, reps, weight, complete, set_type) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            exerciseId,
            set.set_number,
            set.reps,
            set.weight,
            set.complete,
            set.set_type,
          ]
        );
      }
    }

    res.json("Workout inserted successfully.");
  } catch (error) {
    console.error("Problem inserting workout:", error);
    res.status(500).send("Server Error");
  }
});

//Delete previous workout route
app.delete("${API_BASE_URL}/workouts/:userId/:workoutId", async (req, res) => {
  const { userId, workoutId } = req.params;
  console.log(userId, workoutId);
  try {
    await pool.query(`DELETE FROM workouts WHERE id = $1 AND user_id = $2`, [
      workoutId,
      userId,
    ]);
    res.json({ message: "Workout deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//Update previous workout route
app.put("${API_BASE_URL}/workouts/:userId/:workoutId", async (req, res) => {
  const { workoutId } = req.params;
  const { exercises } = req.body;

  try {
    for (const exercise of exercises) {
      const exerciseResult = await pool.query(
        "SELECT id FROM workout_exercises WHERE workout_id = $1 AND exercise_name = $2;",
        [workoutId, exercise.exercise_name]
      );

      const exerciseId = exerciseResult.rows[0].id;

      for (const set of exercise.sets) {
        await pool.query(
          `UPDATE exercise_sets 
           SET set_number = $1, reps = $2, weight = $3, complete = $4, set_type = $5 
           WHERE workout_exercise_id = $6 AND set_number = $7;`,
          [
            set.set_number,
            set.reps,
            set.weight,
            set.complete,
            set.set_type,
            exerciseId,
            set.set_number,
          ]
        );
      }
    }

    res.json({ message: "Workout updated successfully" });
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).json("Server Error");
  }
});
// Test Connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("${API_BASE_URL}/api/test-connection", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // Simple query to get the current time
    res
      .status(200)
      .json({ message: "Connection successful", time: result.rows[0] });
  } catch (err) {
    console.error("Database connection error:", err);
    res
      .status(500)
      .json({ error: "Database connection failed", details: err.message });
  }
});
