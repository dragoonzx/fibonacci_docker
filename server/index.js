const express = require("express");
const app = express();
const cors = require("cors");
const Sequelize = require("sequelize");
const dbConfig = require("./config/config.json").development;
const User = require("./models").User;
const fib = require("./fibonacci")
const bodyParser = require('body-parser')

connectToDatabase();

app.use(cors());
app.use(bodyParser.json())
app.set('trust proxy', true)

app.get("/", async (req, res) => {
  try {
    const user = await User.findById(1);
    const response = { message: `This response came from the node.js app. User ${user.ip} is on the database.` };
    res.send(response);
  } catch (error) {
    res.status(422).send(error);
  }
});

/*
I need to calculate a result,
save info about user,
then send result to user
*/

app.get("/getResult", (req, res) => {
  try {
    let number = +req.query.num
    let result = fib(number)
    console.log(result)
    console.log(req.ip)
    User.create({
      ip: req.ip,
      number: number,
      result: result
    }).then(response=>{
      res.send({result: response.result})
    }).catch(err=>console.log(err));
  } catch (error) {
    res.status(422).send(error);
  }
});

app.get("/getHistory", (req, res) => {
  try {
    User.findAll({where:{ip: req.ip}, raw: true })
    .then(results=>{
      console.log(results);
      res.send(results)
    }).catch(err=>console.log(err));
  } catch (error) {
    res.status(422).send(error);
  }
});

app.listen(5000, () => console.log("The node.js app is listening on port 5000."));

function connectToDatabase() {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");

      //Check if database was seeded already, and do it if needed
      User.findById(1).then(user => {
        if (!user) {
          console.log("Database is not seeded, will run seeds now...");
          const { exec } = require("child_process");
          try {
            exec("/opt/node_modules/.bin/sequelize db:seed:all", (err, stdout, stderr) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log(stdout);
            });
          } catch (error) {
            console.log("Error while seeding database: ", error);
          }
        } else {
          console.log("Database already seeded.");
        }
      });
    })
    .catch(err => {
      console.log("Unable to connect to the database:", err);
    });
}
