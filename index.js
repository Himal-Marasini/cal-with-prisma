const express = require("express");
const app = express();
const { ForbiddenError } = require("@casl/ability");

let { user } = require("./db");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const ability = require("./casl.ability");
const { accessibleBy, prismaQuery } = require("@casl/prisma");

app.get("/users", async (req, res, next) => {
  try {
    let response = await user.findMany({
      where: accessibleBy(ability).User
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

app.patch("/users", async (req, res, next) => {
  try {
    // let isAllowed = ability.can("update", "User", "balance");

    // if (!isAllowed) {
    //   return res.json({ message: "NOT ALLOWED" });
    // }

    // console.log(accessibleBy(ability, "update").User);
    console.log(accessibleBy(ability, "update", "email_id").User);

    let response1 = await user.findFirst({
      where: accessibleBy(ability, "read").User
    });

    // let response = await user.update({
    //   where: accessibleBy(ability, "update").User,
    //   data: {
    //     balance: 1.5
    //   }
    // });

    return res.json({ data: response1 });
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
      email_id: "test1@gmail.com",
      username: "test",
      password: "test",
      account_type: "DISTRIBUTOR",
      balance: 1.8
    }
  });

  return res.json({ success: true, data });
});

app.listen(4002, () => {
  console.log("PORT LISTENING AT 4002");
});
