<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}

.floatLeft {
  float: left;
}
.floatRight {
  float: right;
}

.card {
  border-radius: 10px;
}

.card-header {
  background: aliceblue;
  padding: 3px;
  text-align: center;
  color: grey;
}

.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 100%;
  border-radius: 5px;
}

.card:hover {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.card-body {
  color: grey;
}
</style>
<template>
  <div class="home marginLeft marginRight">
    <loading
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></loading>
<!-- <Info :message="description" /> -->
    <div class="row">
      <div v-for="price in pricingList" :key="price.id" class="col-md-4" style="text-align: left">
        <div class="card">
          <div class="card-header">
            <h4><b>{{price.planName}}</b></h4>
            <p>{{price.planDescription}}</p>
          </div>
          <div class="card-body" style="text-align:center">
            <p style="font-size:x-large">{{price.planPrice}}</p>
            <p>
              Connect upto <b>{{price.maxAppsCount}}</b> Applications.
            </p>
            <p>
              <b>{{price.maxAuthCount}}</b> auth requests.
            </p>
            <p>
              {{price.supportType}}
            </p>
            <p style="text-align:center">
              <button  class="btn btn-lg btn-primary btn-sm" @click="subscribe(price.id)" :disabled="price.isSubscribed">Subscribe</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: 2%;">
      <div class="col-md-12">        
        <table class="table table-bordered" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th>Subscription Id</th>
              <th>Subscription Date</th>
              <th>Plan Name</th>
              <th>Authentication Limit</th>
              <th>Applications Limit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in subscriptionList" :key="row">
              <th>
                {{row.id}}
              </th>
              <td>{{row.subscriptionDate}}</td>
              <td>{{row.planName}}</td>
              <td>{{row.maxAuthCount}}</td>
              <td>{{row.maxAppsCounts}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import conf from "../config";
import Loading from "vue-loading-overlay";
const { hypersignSDK } = conf;
import Info from "@/components/Info.vue";
export default {
  name: "Presentation",
  components: { Info, Loading },
  data() {
    return {
      description:
        "The subject (or holder) generates verifiable presentation from one or more verifiable \
      k.",
      active: 0,
      host: location.hostname,
      user: {},
      prevRoute: null,
      authToken: localStorage.getItem("authToken"),
      pricingList: [],
      subscriptionList: [],
      fullPage: true,
      isLoading: false,
    };
  },
  async created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);

    let url = `${this.$config.studioServer.BASE_URL}hs/api/v2/price`;
    let options = {
      method: "GET",
    };

    this.pricingList = await this.fetchData(url, options);
    console.log(this.pricingList);

    url = `${this.$config.studioServer.BASE_URL}hs/api/v2/subscription`;
    options = {
      method: "GET",
      headers: { Authorization: `Bearer ${this.authToken}` },
    };

    this.subscriptionList = await this.fetchData(url, options);
    console.log(this.subscriptionList);

    this.pricingList = this.pricingList.map((x) => {
      if (this.subscriptionList.some((y) => y.planId == x.id)) {
        x.isSubscribed = true;
      } else {
        x.isSubscribed = false;
      }
      return x;
    });
    console.log(this.pricingList);
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    async fetchData(url, options) {
      this.isLoading = true;
      const resp = await fetch(url, options);
      const json = await resp.json();
      if (json.error || json.status != 200) {
        this.isLoading = false;
        this.notifyErr(json.error);
        return;
      }
      this.isLoading = false;
      return json.message;
    },
    notifySuccess(msg) {
      this.isLoading = false;
      this.$notify({
        group: "foo",
        title: "Information",
        type: "success",
        text: msg,
      });
    },
    notifyErr(msg) {
      this.isLoading = false;
      this.$notify({
        group: "foo",
        title: "Error",
        type: "error",
        text: msg,
      });
    },
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    async subscribe(planId) {
      let url = `${this.$config.studioServer.BASE_URL}hs/api/v2/subscription/create`;
      let options = {
        method: "POST",
        body: JSON.stringify({
          planId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
      };
      const resp = await this.fetchData(url, options);
      if (resp) {
        this.subscriptionList.push(resp);
        this.pricingList = this.pricingList.map(x => {
          if(x.id == resp.planId){
            x.isSubscribed =  true;
          }
          return x;
        })
        this.notifySuccess("Plan successfully subscribed");
      }
    },
  },
};
</script>


