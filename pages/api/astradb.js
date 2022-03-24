import {exec} from "child_process";
import {statSync} from "fs";

const {createClient} = require("@astrajs/rest");

let astraClient = null;
const getAstraClient = async () => {
  if (astraClient === null) {
    astraClient = await createClient(
      {
        astraDatabaseId: process.env.NEXT_PUBLIC_ASTRA_DB_ID,
        astraDatabaseRegion: process.env.NEXT_PUBLIC_ASTRA_DB_REGION,
        applicationToken: process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN,
      });
  }
  // console.log(astraClient);
  return astraClient;
};

export const getProducts = async () => {
  const client = await getAstraClient();
  const {status, data} = await client.get(
    '/api/rest/v2/keyspaces/cryptocommerce/catalog/rows'
  );
  // console.log(data);
  return data;
}

export const getProduct = async (id) => {
  const client = await getAstraClient();
  const {status, data} = await client.get(
    `/api/rest/v2/keyspaces/cryptocommerce/catalog/${id}`
  );
  // console.log(data);
  return data;
}

