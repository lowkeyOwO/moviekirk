import fetch from "node-fetch";
import { config } from "dotenv";
config();

/*
Step 2
Considers the username, password provided by the user and validates it
if exists, the request token is validated
*/

export default async function userAuth(params, reqBody) {
  const AuthURL = `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${process.env.API_KEY2}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: reqBody.username,
      password: reqBody.password,
      request_token: params.request_token,
    }),
  };
  try {
    const result = await fetch(AuthURL, options);
    const response = await result.json();
    console.log("userAuth.js :\t", response);
    return response;
  } catch (err) {
    console.error("Error:\t", err);
    return { error: err };
  }
}
