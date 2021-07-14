<template>
  <h1>404 Not Found</h1>
</template>

<script>
import router from "../router";
export default {
  name: "NotFound",
  created: function() {
    this.gohome();
  },
  methods: {
    gohome() {
      setTimeout(router.push("/"), 5000);
    },
  },
};
</script>
