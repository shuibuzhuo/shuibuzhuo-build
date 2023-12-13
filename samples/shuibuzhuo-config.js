module.exports = {
  entry: "src/index.js",
  hooks: [
    [
      "start",
      function (context) {
        console.log("start", context);
      },
    ],
    [
      "configResolved",
      function (context) {
        console.log("configResolved", context);
      },
    ],
  ],
};
