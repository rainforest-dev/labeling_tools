<template lang="pug">
  v-app(dark)
    router-view
</template>

<script>
export default {
  name: 'App',

  components: {

  },

  data: () => ({
    //
  }),
};
</script>
<style lang="scss">
html, body {
  @include size(100%);
  margin: 0;
  padding: 0;
}
.fill-height {
  height: 100%;
}
</style>
