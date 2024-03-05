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
  origin: "http://localhost:3000", // Allow requests from localhost:3000
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type, Authorization", // Add any additional headers you need
  // credentials: true, // Set this to true if your client sends credentials (e.g., cookies)
};

app.use(cors(corsOptions));
// Handle CORS preflight requests for all routes
app.options("*", cors(corsOptions));

app.use(
  "/graphql",
  (req, res, next) => {
    // Set Access-Control-Allow-Origin header
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
  },
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(process.env.PORT, console.log(`listening on ${process.env.PORT}`));
