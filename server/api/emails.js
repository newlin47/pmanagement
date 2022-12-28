const express = require("express");
const app = express.Router();
const nodemailer = require("nodemailer");
const { User } = require("../db");
const htmlToText = require("nodemailer-html-to-text").htmlToText;

module.exports = app;

app.post("/test", async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Zoho",
      auth: {
        user: "devtest2207@zohomail.com",
        pass: process.env.EMAILPASS,
      },
    });
    const mailOptions = {
      from: "devtest2207@zohomail.com",
      to: "ramir101@gmail.com",
      subject: "Sending Email using Node.js",
      text: "second test",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: 2 " + info.response);
      }
    });

    res.sendStatus(201);
  } catch (ex) {
    next(ex);
  }
});

app.post("/invite/team", async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Zoho",
      auth: {
        user: "devtest2207@zohomail.com",
        pass: process.env.EMAILPASS,
      },
    });
    const mailOptions = {
      from: "devtest2207@zohomail.com",
      to: req.body.recipient,
      subject: `You have been invited to join ${req.body.senderName} \'s team`,
      html: `<a href='https://rekj-capstone.herokuapp.com/#/login/${req.body.teamId}'>Click this link to join ${req.body.senderName}\'s team</a>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: 2 " + info.response);
      }
    });
    res.sendStatus(201);
  } catch (ex) {
    next(ex);
  }
});

app.post("/summary", async (req, res, next) => {
  try {
    const recipient = await User.findByPk(req.body.userId);
    const teamMembers = await User.findAll({
      where: {
        teamId: req.body.teamId,
      },
    });
    const dateFormatter = (dateString) => {
      return `${dateString.slice(5, 7)}/${dateString.slice(
        8,
        10
      )}/${dateString.slice(0, 4)}`;
    };
    const emailHTML = `
    <div>
      <h2>Daily summary of project - ${req.body.name}</h2>
      <div>
        <h3>List of tasks</h3>
        <div>
          <h4>Backlog:</h4>
            <ul>
            ${req.body.tasks
              .map((task) => {
                if (task.status === "Backlog") {
                  return `
                  <div>
                    <li>${task.name}: ${task.description}
                      <ul>
                        <li>Assignee: ${
                          teamMembers.find((user) => user.id === task.userId)
                            .firstName
                        }</li>
                        <li>
                          Deadline: ${
                            task.deadline
                              ? dateFormatter(task.deadline)
                              : "None"
                          }
                        </li>
                      </ul>
                    </li>
                  </div>`;
                }
              })
              .join("")}
            </ul>
        </div>
        <div>
          <h4>To Do:</h4>
            <ul>
              ${req.body.tasks
                .map((task) => {
                  if (task.status === "To Do") {
                    return `
                    <div>
                      <li>${task.name}: ${task.description}
                        <ul>
                          <li>Assignee: ${
                            teamMembers.find((user) => user.id === task.userId)
                              .firstName
                          }</li>
                          <li>
                            Deadline: ${
                              task.deadline
                                ? dateFormatter(task.deadline)
                                : "None"
                            }
                          </li>
                        </ul>
                      </li>
                    </div>`;
                  }
                })
                .join("")}
            </ul>
        </div>
        <div>
          <h4>In Progress:</h4>
            <ul>
              ${req.body.tasks
                .map((task) => {
                  if (task.status === "In Progress") {
                    return `
                    <div>
                      <li>${task.name}: ${task.description}
                        <ul>
                          <li>Assignee: ${
                            teamMembers.find((user) => user.id === task.userId)
                              .firstName
                          }</li>
                          <li>
                            Deadline: ${
                              task.deadline
                                ? dateFormatter(task.deadline)
                                : "None"
                            }
                          </li>
                        </ul>
                      </li>
                    </div>`;
                  }
                })
                .join("")}
            </ul>
        </div>
        <div>
          <h4>Done:</h4>
            <ul>
              ${req.body.tasks
                .map((task) => {
                  if (task.status === "Done") {
                    return `
                    <div>
                      <li>${task.name}: ${task.description}
                        <ul>
                          <li>Assignee: ${
                            teamMembers.find((user) => user.id === task.userId)
                              .firstName
                          }</li>
                          <li>
                            Deadline: ${
                              task.deadline
                                ? dateFormatter(task.deadline)
                                : "None"
                            }
                          </li>
                        </ul>
                      </li>
                    </div>`;
                  }
                })
                .join("")}
            </ul>
    </div>`;
    // email setup
    const transporter = nodemailer.createTransport({
      service: "Zoho",
      auth: {
        user: "devtest2207@zohomail.com",
        pass: process.env.EMAILPASS,
      },
    });

    teamMembers.forEach((member) => {
      const mailOptions = {
        from: "devtest2207@zohomail.com",
        to: member.email,
        subject: `Daily summary of project - ${req.body.name}`,
        html: emailHTML,
      };
      transporter.use("compile", htmlToText());

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(
            `Summary Email sent to ${member.email} / ${member.firstName}` +
              info.response
          );
        }
      });
    });
    //Code for sending to only admin
    // const transporter = nodemailer.createTransport({
    //   service: "Zoho",
    //   auth: {
    //     user: "devtest2207@zohomail.com",
    //     pass: process.env.EMAILPASS,
    //   },
    // });
    // const mailOptions = {
    //   from: "devtest2207@zohomail.com",
    //   to: recipient.email,
    //   subject: `Daily summary of project - ${req.body.name}`,
    //   html: emailHTML,
    // };
    // transporter.use("compile", htmlToText());

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Summary Email sent to " + info.response);
    //   }
    // });
    res.sendStatus(201);
  } catch (ex) {
    next(ex);
  }
});
