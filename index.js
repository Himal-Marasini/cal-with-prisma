const express = require("express");
const app = express();
const { ForbiddenError } = require("@casl/ability");

const { user } = require("./db");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const ability = require("./casl.ability");
const { accessibleBy } = require("@casl/prisma");

app.get("/users", async (req, res, next) => {
  try {
    let response = await user.findMany({
      where: accessibleBy(ability).User,
    });
    return res.json({ data: response });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      console.log(1);
      console.log(error.message); // You are not allowed to read private information
      return;
    }
    console.log(2);
    // return res.json({ message: error.message });
  }
});

app.patch("/users", async (req, res, next) => {
  try {
    let isAllowed = ability.can("update", "User", "balance");

    if (!isAllowed) {
      return "NOT ALLOWED";
    }

    let response = await user.update({
      where: {
        id: "0cb8aab33-c03c-4959-9519-1b5398aef9d9",
      },
      data: {
        balance: 1.5,
      },
    });

    return res.json({ data: response });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      console.log(1);
      console.log(error.message); // You are not allowed to read private information
      return;
    }
    console.log(2);
    return res.json({ message: error.message });
  }
});

app.post("/users", async (req, res, next) => {
  let data = await user.create({
    data: {
      email_id: "aaaabc@gmail.com",
      username: "aaaa",
      password: "aaaa",
      account_type: "DISTRIBUTOR",
      balance: 1.5,
    },
  });

  return res.json({ success: true, data });
});

app.listen(4002, () => {
  console.log("PORT LISTENING AT 4002");
});
