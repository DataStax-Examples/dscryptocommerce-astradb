import {exec} from "child_process";
import {statSync} from "fs";

const { createClient } = require("@astrajs/rest");

let astraClient = null;
const getAstraClient = async () => {
  if (astraClient === null) {
    astraClient = await createClient(
      {
        astraDatabaseId: process.env.NEXT_PUBLIC_ASTRA_DB_ID,
        astraDatabaseRegion: process.env.NEXT_PUBLIC_ASTRA_DB_REGION,
        applicationToken: process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN,
          astraDatabaseKeyspace: process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE,
    });
  }
  // console.log(astraClient);
  return astraClient;
};

export const getProducts = async() => {
    const client = await getAstraClient();
    const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
    const { status, data}  = await client.get(
        `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/rows/`
    );
    // console.log(data);
    return data;
}

export const getProduct = async(id) => {
  const client = await getAstraClient();
  const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
  const { status, data}  = await client.get(
      `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/${id}`
  );
  // console.log(data);
  return data;
}

// export const trackSession = async(dateTime, account, productId, session_message) => {
//     const client = await getAstraClient();
// const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
//     const { status, data } = await client.post(
//         `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/activity_stream`,
//         {
//         timestamp: dateTime,
//         wallet_address: account,
//         product_id: productId,
//         action: session_message
//     });
// }

// export const updateProduct = async(id, product_status, account) => {
//     const client = await getAstraClient();
//     const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
//     const { status, data } = await client.patch (
//         `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/${id}`,
//         {
//             product_status: product_status,
//             buyer_address: account
//         }
//     );
// }


