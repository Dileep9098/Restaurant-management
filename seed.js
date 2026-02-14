// require("dotenv").config();
// const db = require("./config/db");
// const Role = require("./models/Role");
// const User = require("./models/User");
// const bcrypt = require("bcryptjs");

import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/database.js";
import Role from "./models/roleModel.js";
import User from "./models/userModel.js";
import bcrypt from "bcrypt";
(async () => {
  await connectDB();

  const adminRole = await Role.create({
    name: "admin",
    permissions: [
      "roles.create", "roles.view",
      "users.view", "users.update",
      "leads.create", "leads.update", "leads.view"
    ]
  });

  await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: await bcrypt.hash("123456", 10),
    role: adminRole._id
  });

  console.log("Admin Created");
  process.exit();
})();
