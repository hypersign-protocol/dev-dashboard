<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="3"  v-for="(item,i) in projects" :key=i>
        <b-card
        >
          <blockquote class="card-blockquote">
            <p class="text-white">{{item.serviceEndPoint}}</p>
            <p class="text-white"><a href="#">{{item.appId}}</a></p>
            <div v-html="avatar().src" class="user-avatar"/>
            <p class="lead text-white">{{item.appName}}</p>
            <footer>
              <!-- <cite title="Source Title">Source Title</cite> -->
            </footer>
          </blockquote>
        </b-card>
      </b-col>

    </b-row><!--/.row-->
   
  </div>
</template>
<style scoped>
.user-avatar {
  text-align: center;
}
img {
  overflow: inherit;
}

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
.card-header:first-child {
    border-radius: .75rem;
}
.card {
    border-radius: .75rem !important;
    border: initial;
    background: #1e2022;
    border-radius: calc(.15rem - 1px);
    -webkit-box-shadow: 0 1px 15px rgba(0,0,0,.1), 0 1px 8px rgba(0,0,0,.1);
    box-shadow: 0 1px 15px rgba(0,0,0,.1), 0 1px 8px rgba(0,0,0,.1);
    cursor: pointer;
}
.text-white {
    color: #d0d0d0!important;
}

.lead {
    font-size: 1.8rem;
    font-weight: 300;
    line-height: 2rem;
}
</style>
<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

export default {
  name: 'cards',
  data () {
      return {
        projects: [{
          appId:'hkhkjhkj',
          appName:'App 1',
          serviceEndPoint:'http://localhost:8080/',
          logo:'',
          otherDetails:{}
        },
        {
          appId:'hkhkjhkj',
          appName:'App 2',
          serviceEndPoint:'http://localhost:3000/',
          logo:'',
          otherDetails:{}
        },
        {
          appId:'hkhkjhkj',
          appName:'App 3',
          serviceEndPoint:'http://localhost:9000/',
          logo:'',
          otherDetails:{}
        },
        {
          appId:'hkhkjhkj',
          appName:'App 4',
          serviceEndPoint:'http://localhost:7000/',
          logo:'',
          otherDetails:{}
        }]
      }
  },
  computed : {
    
  },
  methods: {
    avatar() {
      const avatars = new Avatars(sprites, {height:100});
      return {
        type: 'avatar',
        src: avatars.create(makeid(6)),
      }
    }
  }
}
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
</script>
