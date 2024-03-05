import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema.js";
import connectDB from "./config/db.js";

const app = express();
dotenv.config(); // add .env file path
// connect to DB
connectDB();

app.use(
  cors({
    origin: {
      local: "http://localhost:3000",
      prod: ["https://react-graphql-node-mongo-app.onrender.com"],
    },
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(process.env.PORT, console.log(`listening on ${process.env.PORT}`));
