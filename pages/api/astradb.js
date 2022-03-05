import {exec} from "child_process";
import {statSync} from "fs";

const { createClient } = require("@astrajs/rest");

let astraClient = null;
const getAstraClient = async () => {
  if (astraClient === null) {
    astraClient = await createClient(
      {
        astraDatabaseId: process.env.ASTRA_DB_ID,
        astraDatabaseRegion: process.env.ASTRA_DB_REGION,
        applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
    });}
  // console.log(astraClient);
  return astraClient;
};

export const getProducts = async() => {
    const client = await getAstraClient();
    const { status, data}  = await client.get(
        '/api/rest/v2/keyspaces/demoks/catalog/rows'
    );
    // console.log(data);
    return data;
}

export const getProduct = async(id) => {
  const client = await getAstraClient();
  const { status, data}  = await client.get(
      `/api/rest/v2/keyspaces/demoks/catalog/${id}`
  );
  // console.log(data);
  return data;
}

export const addReview = async (movie_id, user_id, score) => {
    const client = await getAstraClient();
    var dateTime = new Date().toISOString();
    const status = await client.post(
        '/api/rest/v2/keyspaces/movies/movie_rating_by_movie_id',
        {
            "user_id" : user_id,
            "movie_id" : movie_id,
            "rating" : score,
            "date_created": dateTime
        }

    );
    return status;
}
