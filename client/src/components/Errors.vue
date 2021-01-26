<style scoped>
.error {
  color: white;
  background: rgba(255, 89, 67, 0.78);
  padding: 10px;
  text-align: left;
  font-size: inherit;
  border-radius: 3px;
  margin-bottom: 2%;
}
</style>

<template>
  <div class="error">
    <p>Fields validation:</p>
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>


<script>
export default {
  name: "Errors",
  props: ["errors"],
  mounted() {
    //console.log("The prop contain following message: " + this.message)
  },
};
</script>