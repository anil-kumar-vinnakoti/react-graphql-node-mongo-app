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

const corsOptions = {
  origin: "http://localhost:3000", // Change this to the specific origin of your React app in production
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // preflightContinue: false,
  // optionsSuccessStatus: 204,
  // allowedHeaders: "Content-Type, Authorization", // Add any additional headers you need
  // credentials: true, // Set this to true if your client sends credentials (e.g., cookies)
};

app.use(cors(corsOptions));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(process.env.PORT, console.log(`listening on ${process.env.PORT}`));
