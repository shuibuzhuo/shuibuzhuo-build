module.exports = {
  entry: "src/index.js",
  hooks: [
    [
      "created",
      function (context) {
        console.log("created", context);
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
