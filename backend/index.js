// External Libraries
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { config } from "dotenv";
import redis from "ioredis";
import cors from "cors";

// Custom modules and functions
import getRequestToken from "./generators/tokenRequest.js";
import userAuth from "./generators/userAuth.js";
import newSession from "./generators/newSession.js";
import cacheCheck from "./cache/cacheCheck.js";
import addToCache from "./cache/addToCache.js";

config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Creating redis client
const redisParams = {
  password: process.env.REDIS_PW,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_UNAME,
};
const client = redis.createClient(redisParams);

app.post(
  "/request",
  expressAsyncHandler(async (req, res) => {
    const reqBody = req.body;
    const requestTokenGenerator = await getRequestToken();
    const userAuthenticator = await userAuth(requestTokenGenerator, reqBody);
    let session_id = "";
    if (userAuthenticator.success) {
      // Checking in cache if a session id already exists for the user
      try {
        const checkSesh = await cacheCheck(reqBody.username, client);

        if (checkSesh !== null) {
          session_id = checkSesh;
        } else {
          const seshVal = await newSession(userAuthenticator, res);
          session_id = seshVal.session_id;
          await addToCache(reqBody.username, session_id, client);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      //   cacheCheck(reqBody.username, client)
      //   .then(checkSesh => {
      //     if (checkSesh !== null) {
      //         session_id = checkSesh
      //     } else {
      //         newSession(userAuthenticator, res)
      //         .then(seshVal => session_id = seshVal.session_id)
      //         .then(ret => addToCache(reqBody.username,session_id,client))
      //     }
      //   })
      //   if (success) {
      //       session_id = checkSession.data
      //   } else {
      //       const newSessionGenerator = await newSession(userAuthenticator, res);
      //       session_id = await newSessionGenerator.session_id;
      //       await addToCache(reqBody.username,session_id,client)
      //   }
    }
  })
);

app.listen(PORT, () => {
  console.log(`Successfully listening on ${PORT}!`);
  client.on("connect", () => {
    console.log("Connected to Redis!\n");
  });
  client.on("error", (error) => {
    console.error("Redis error:", error);
  });
});
