const detectPort = require("detect-port");
const inquirer = require("inquirer");
const Service = require("../service/Service");

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
  const { config = "" } = paramsObj;

  try {
    const newPort = await detectPort(defaultPort);
    if (newPort !== defaultPort) {
      const questions = {
        type: "confirm",
        name: "answer",
        message: "请输入",
        message: `${defaultPort} 端口已被占用，是否启用新端口 ${newPort}?`,
      };
      const answer = (await inquirer.prompt(questions)).answer;
      if (!answer) {
        process.exit(1);
      }
    }

    const args = {
      port: newPort,
      config,
      customWebpackPath: paramsObj.customWebpackPath || "",
      stopBuild: paramsObj.stopBuild === "true",
    };

    process.env.NODE_ENV = "development";

    const service = new Service("dev", args);

    service.start();
  } catch (error) {
    console.error(error);
  }
})();
