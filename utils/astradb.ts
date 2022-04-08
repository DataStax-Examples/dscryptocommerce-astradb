const {createClient} = require("@astrajs/rest");

export const getAstraClient = async () => {
  return await createClient(
    {
      astraDatabaseId: process.env.NEXT_PUBLIC_ASTRA_DB_ID,
      astraDatabaseRegion: process.env.NEXT_PUBLIC_ASTRA_DB_REGION,
      applicationToken: process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN,
      astraDatabaseKeyspace: process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE,
    });
};

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


