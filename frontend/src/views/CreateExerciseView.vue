<script setup>
import { ref } from "vue";

const exercise_name = ref("");
const target = ref("");
const equipment = ref("");

function postData() {
  const formData = {
    exercise_name: exercise_name.value,
    target: target.value,
    equipment: equipment.value,
  };

  // Uncomment to send form data to server
  // fetch("http://localhost:3000/create-exercise", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  //   body: JSON.stringify(formData),
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data);
  //     router.push("/");
  //   });
}
</script>

<template>
  <div class="wrapper">
    <form @submit.prevent="postData()">
      <div class="input-group">
        <label for="exercise_name">Exercise Name:</label>
        <input
          type="text"
          id="exercise_name"
          name="exercise_name"
          v-model="exercise_name"
        />
      </div>

      <div class="input-group">
        <label for="target">Muscle Targeted:</label>
        <select id="target" v-model="target">
          <option disabled value="">Please select a muscle group</option>
          <option value="chest">Chest</option>
          <option value="legs">Legs</option>
          <option value="arms">Arms</option>
          <option value="back">Back</option>
          <option value="shoulders">Shoulders</option>
          <option value="core">Core</option>
        </select>
      </div>

      <div class="input-group">
        <label for="equipment">Equipment:</label>
        <select id="equipment" v-model="equipment">
          <option disabled value="">Please select equipment</option>
          <option value="barbell">Barbell</option>
          <option value="dumbbell">Dumbbell</option>
          <option value="bodyweight">Bodyweight</option>
          <option value="machine">Machine</option>
          <option value="kettlebell">Kettlebell</option>
        </select>
      </div>

      <div class="input-group">
        <input type="submit" value="Create Exercise" class="submit-btn" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
}

form {
  background: #fff;
  padding: 20px;
  width: 100%;
  max-width: 400px;
}

.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
}

input[type="submit"] {
  padding: 10px;
  font-size: 16px;
  background-color: #474747;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
}

input[type="submit"]:hover {
  opacity: 0.8;
}
</style>
