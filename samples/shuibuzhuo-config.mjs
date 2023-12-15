export default {
  entry: "src/index.js",
  plugins: function () {
    return [
      ["shuibuzhuo-build-test", { a: 10, b: 20 }],
      function () {
        console.log("this is anonymous plugin");
      },
    ];
  },
  hooks: [],
};
