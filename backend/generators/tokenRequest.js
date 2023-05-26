import fetch from "node-fetch";
import {config} from 'dotenv';
config();

/*
Step 1 
Generates a new Request token to process a request
*/

export default async function getRequestToken() {
  const generateRequestTokenURL = `https://api.themoviedb.org/3/authentication/token/new`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer "+`${process.env.API_KEY}`,
    },
  };
  try {
    const result = await fetch(generateRequestTokenURL, options);
    const response = await result.json();
    console.log("tokenRequest.js :\t", response);
    return response;
  } catch (err) {
    console.err("Error:\t", err);
    return {error: err};
  }

  // add try catch later
}
