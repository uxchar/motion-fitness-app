require("dotenv").config();

let express = require("express");
let bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const validateToken = require("./middleware/authmiddleware");

let app = express();

const pool = new Pool({
  user: "chauncey",
  host: "localhost",
  database: "motion_app",
  password: "password",
  port: 5432,
});

const corsOptions = {
  origins: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const API_KEY = process.env.API_KEY;

app.get("/api/data", async (req, res) => {
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
          rejectUnauthorized: false, // Disable SSL verification
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

app.get("/workouts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
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
      workout_exercises.exercise_name, exercise_sets.set_number;
    `,
      [userId]
    );

    const workouts = [];

    result.rows.forEach((row) => {
      let workout = workouts.find(
        (workoutItem) => workoutItem.workout_id === row.workout_id
      );

      if (!workout) {
        workout = {
          workout_id: row.workout_id,
          workout_date: row.workout_date,
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

    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/workout/:userId", async function (req, res) {
  const { userId } = req.params;
  const { exercises, startTime, finishTime } = req.body;

  try {
    const workoutResult = await pool.query(
      "INSERT INTO workouts(user_id, start, finish) VALUES ($1, $2, $3) RETURNING id",
      [userId, startTime, finishTime]
    );
    const workoutId = workoutResult.rows[0].id;

    //helpful link understanding loop types: https://medium.com/@trig79/javascript-the-early-lessons-for-vs-foreach-vs-for-of-loops-iteration-which-one-is-better-b557f385045

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

// app.delete("/workouts/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const result = await pool.query(
//       `DELETE FROM workouts WHERE id = $1 AND user_id = $2,
//   `,
//       [id, userId]
//     );
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

// app.post("/login", (req, res) => {
//   //get email and password
//   const { email, password } = req.body;
//   //check email and password match
//   pool.query(
//     "SELECT * FROM users WHERE email = $1 AND password = $2",
//     [email, password],
//     (error, results) => {
//       if (error) {
//         console.log(error);
//       }
//       if (results.rows.length > 0) {
//         const token = jwt.sign(
//           { userID: results.rows[0].id },
//           process.env.JWT_SECRET,
//           {
//             expiresIn: "1h",
//           }
//         );
//         res.send(token);
//       } else {
//         res.send("User login unsuccessful. Incorrect login details.");
//       }
//     }
//   );
//   send back auth token if successful
// });

// app.get("/:id", validateToken, (req, res) => {});
// app.get("/:id/templates", validateToken, (req, res) => {});
// app.get("/:id/custom-exercises", validateToken, (req, res) => {});

// app.post("/:id/workout", validateToken, (req, res) => {});
// app.post("/:id/create-template", validateToken, (req, res) => {});
// app.post("/:id/create-exercise", validateToken, (req, res) => {});

// app.put("/:id/:template_id/update-template", validateToken, (req, res) => {});
// app.put("/:id/:workout_id/update-workout", validateToken, (req, res) => {});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
