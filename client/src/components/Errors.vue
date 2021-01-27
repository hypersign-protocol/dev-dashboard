<style scoped>
.error {
  color: rgba(251, 65, 40, 0.78);
  /* background: rgba(255, 89, 67, 0.78); */
  border: 1px solid rgba(255, 89, 67, 0.78);
  padding: 10px;
  text-align: left;
  font-size: inherit;
  border-radius: 3px;
  margin-bottom: 2%;
  font-size:medium;
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