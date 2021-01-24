<template>
  <div class="row">
    <div class="col-md-12">
      <vc-donut
        background="white"
        foreground="grey"
        :size="300"
        unit="px"
        :thickness="30"
        has-legend
        legend-placement="top"
        :sections="sections"
        :total="subscriptionDetials.maxAuthCount"
        :start-angle="0"
        :auto-adjust-text-size="true"
        @section-click="handleSectionClick"
      >
        <h1>{{ leftAuthPercentage }}</h1>
      </vc-donut>
    </div>
    <!-- <div class="col-md-6">
      <vc-donut
        background="white"
        foreground="grey"
        :size="200"
        unit="px"
        :thickness="30"
        has-legend
        legend-placement="top"
        :sections="sectionsApps"
        :total="subscriptionDetials.maxAppsCounts"
        :start-angle="0"
        :auto-adjust-text-size="true"
        @section-click="handleSectionClick"
      >
        <h1>{{ leftApps }}</h1>
      </vc-donut>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      leftAuthPercentage: 0,
      user: {},
      subscriptionDetials: {},
      leftApps: 0,
      sections: [{ label: "Used Auth Requests", value: 0, color: "red" }],
      sectionsApps: [{ label: "Apps Created", value: 0, color: "red" }],
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);

    this.subscriptionDetials = { ...this.user.subscriptionDetail };
    this.subscriptionDetials.authCount = this.subscriptionDetials.authCount == ""  ? 0  : parseInt(this.subscriptionDetials.authCount);
    this.subscriptionDetials.maxAuthCount =
      this.subscriptionDetials.maxAuthCount == ""
        ? 0
        : parseInt(this.subscriptionDetials.maxAuthCount);
    this.subscriptionDetials.numberOfApps =
      this.subscriptionDetials.numberOfApps == ""
        ? 0
        : parseInt(this.subscriptionDetials.numberOfApps);
    this.subscriptionDetials.maxAppsCounts =
      this.subscriptionDetials.maxAppsCounts == ""
        ? 0
        : parseInt(this.subscriptionDetials.maxAppsCounts);

    this.sections[0].value = this.subscriptionDetials.authCount;

    this.leftAuthPercentage =
      this.subscriptionDetials.maxAuthCount -
      this.subscriptionDetials.authCount;
    console.log(JSON.stringify(this.subscriptionDetials));
    this.leftApps =
      this.subscriptionDetials.maxAppsCounts -
      this.subscriptionDetials.numberOfApps;

    this.sectionsApps[0].value = this.subscriptionDetials.numberOfApps;
    
  },
  methods: {
    handleSectionClick(section, event) {
      console.log(`${section.label} clicked.`);
    },
  },
};
</script>