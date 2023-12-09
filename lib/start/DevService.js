console.log("DevService...");
console.log(process.argv);
console.log(process.pid);
console.log(process.ppid);

process.on("message", (data) => {
  console.log("data from main", data);
});
process.send("message from child process");
