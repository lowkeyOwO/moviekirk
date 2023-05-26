import fetch from "node-fetch";
import { config } from "dotenv";
config();

/*
Step 3
Once validated the request token is used to create a session ID which can be used for all user actions
*/

export default async function newSession(params, res) {
  const newSessionURL = `https://api.themoviedb.org/3/authentication/session/new?api_key=${process.env.API_KEY2}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request_token: params.request_token,
    }),
  };
  try {
    const result = await fetch(newSessionURL, options);
    const response = await result.json();
    console.log("newSession.js :\t", response);
    return response;
  } catch (err) {
    console.error("Error:\t", err);
    return { error: err };
  }
}
