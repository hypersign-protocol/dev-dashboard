<style scoped>
.logo {
  /* width: 144px; */
  padding-top: 1.5%;
  padding-left: 25px;
}

.selectedButton{
  border-bottom: 1px solid #8080809e;
  font-weight: bold;
}

.nav-style{
  background: #FFFFFF;
  margin-bottom: 1%;
  padding:5px;
  padding-left:1.5%;
  text-align: left;
  box-shadow:
         rgba(0, 0, 0, 0.1) 0px 2px 2px 0px, 
            rgba(0, 0, 0, 0.02) 0px 3px 1px -2px, 
            rgba(0, 0, 0, 0.01) 0px 1px 5px 0px;
}

.rightAlign{
  text-align: end;
}

.card-radius{
  border-radius: 10px;
}


.logo-style {
    width: 144px;
    /* height: 40px; */
    margin-top: 9px;
    margin-left: 5px;
}

#app {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background: #F6F6F687;
}

.subtitle{
  padding-left: 10px;
  color: gray;
  font-size: larger;
  margin-top: auto;
}


</style>
<template>
  <div id="app">
    <div class="row nav-style">
      <div class="col-md-4">        
        <div class="form-group form-inline">
          <img src="https://thumb.tildacdn.com/tild3065-3765-4865-b331-393637653931/-/resize/150x/-/format/webp/hypersign_Yellow.png" style="width: 23%;margin-top: 1%"/><h4 class="subtitle">  {{$config.app.name}} ({{$config.app.version}})</h4>  
        </div>
      </div>
        <div class="col-md-8 rightAlign" style="padding-top:12px" v-if="!(authRoutes.includes($router.history.current.name))">
            <button type="button" @click="goToNextPage(m.name)" class="btn btn-light btn-sm" v-for="m in menu" :key="m.name">{{m.name}}</button>    
        </div>      
    </div>
    <router-view />
    <notifications group="foo" />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.centeralign {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.leftAlign {
  text-align: left;
}
.rightAlign {
  text-align: right;
}
.marginLeft
{
margin-left: 13%
}
.marginRight
{
margin-right: 12%
}
</style>


<script>
export default {
  data(){
    return {
      authRoutes:  ['register', 'PKIIdLogin'],
      menu: [
        { 
          name: "Dashboard",  
          path: "/studio/dashboard",
          isShow: true,
        },
        { 
          name: "Schema",  
          path: "/studio/schema",
          isShow: true,
        },
        { 
          name: "Apps",  
          path: "/studio/apps",
          isShow: true,
        },
        { 
          name: "Subscription",  
          path: "/studio/subscription",
          isShow: true,
        },
        { 
          name: "Docs",  
          path: "",
          isShow: true,
        },
        {
          name: "Logout",
          path: "/login",
          isShow: false,
        },        
      ]
    }
  },
  methods: {
    logout(){
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
    },
    goToNextPage(route){
      const r = this.menu.find(x => x.name === route)
      if(r.name === "Logout") this.logout();

      if(r.name === "Docs") {

        window.open("https://docs.hypersign.id/developer/developer-dashboard")
        return;
      }

      this.$router.push(r.path)
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push(r.path)
                }
    }
  }
}
</script>
