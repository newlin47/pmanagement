const app = require("./app");
const { syncAndSeed, Project, Task, Log } = require("./db");
const schedule = require("node-schedule");
const logger = require("./logger");

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();

const job = schedule.scheduleJob("0 21 * * *", function () {
  logger(Project, Task, Log);
});
