const detectPort = require("detect-port");

(async function () {
  const DEFAULT_PORT = 8000;

  const params = process.argv.slice(2);

  const paramsObj = {};

  params.forEach((param) => {
    const paramArr = param.split(" ");
    paramsObj[paramArr[0].replace("--", "")] = paramArr[1];
  });

  let defaultPort = paramsObj["port"] || DEFAULT_PORT;
  defaultPort = parseInt(defaultPort, 10);

  console.log("defaultPort", defaultPort);

  try {
    const newPort = await detectPort(defaultPort);
    if (newPort === defaultPort) {
      console.log(`端口号${defaultPort}可以使用`);
    } else {
      console.log(`端口号${defaultPort}被占用`);
    }
  } catch (error) {
    console.error(error);
  }
})();

// console.log("DevService...");
// console.log(process.argv);
// console.log(process.pid);
// console.log(process.ppid);

// process.on("message", (data) => {
//   console.log("data from main", data);
// });
// process.send("message from child process");
