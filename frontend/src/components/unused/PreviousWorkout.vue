<script setup>
const props = defineProps(["cell"]);
</script>

<template>
  <div class="exercise-wrapper">
    <div class="img-container">
      <img
        class="exercise-image"
        :src="cell.exercise_image"
        alt="exercise image"
      />
    </div>
    <div class="exercise-name">cell.exercise_name</div>
    <div class="muscle-group">cell.muscle_group</div>
    <div class="equipment">cell.equipment</div>
  </div>
</template>

<style scoped></style>
