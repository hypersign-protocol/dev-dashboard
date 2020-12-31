<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="6" md="4">
        <b-card 
        class=" selected"
        header="Developers">
          <blockquote class="card-blockquote">
            <p>- 1500 auth request. </p>
            <p>- 100 - 150 new users. </p>
            <p>- 1 APP key</p>
            <p>- 45 days</p>
            <footer>- $ 0 
              <!-- <cite title="Source Title">Source Title</cite> -->
            </footer>
          </blockquote>
        </b-card>
      </b-col>
      
      <b-col sm="6" md="4">
        <b-card class="" header="Startups & SME's">
          <blockquote class="card-blockquote">
            <p>- 30000 auth request. </p>
            <p>- 250 - 300 new users. </p>
            <p>- upto 5 APP key</p>
            <p>- 90 days</p>
            <footer>- $ 21
              <!-- <cite title="Source Title">Source Title</cite> -->
            </footer>
          </blockquote>
        </b-card>
      </b-col>
      <b-col sm="6" md="4">
        <b-card class="" header="Enterprise">
          <blockquote class="card-blockquote">
            <p>- unlimited auth request. </p>
            <p>- unlimited new users. </p>
            <p>- unlimited APP key</p>
            <p>- LDAP and SAML Support</p>
            <p>- 1 Year</p>
            <footer>- $ 7000
              <!-- <cite title="Source Title">Source Title</cite> -->
            </footer>
          </blockquote>
        </b-card>
      </b-col>
    </b-row><!--/.row-->
   
  </div>
</template>
<style scoped>
.selected{
  background-image:linear-gradient(to right top,#3a7a96,#4386a3,#509ab9);
  -webkit-transition: .5s;
  transition: .5s;
  background-size: 350% auto;
  cursor: pointer;
}
.selected:hover {
    background-position: 100% 0;
}
.card {
    border-radius: .75rem;
}
.card-header:first-child {
    border-radius: .75rem;
}
</style>
<script>
export default {
  name: 'cards'
}
</script>
