module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/labeling_tools/'
    : '/',
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/scss/_mixins.scss";
        `,
      },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
};
