import {getAstraClient} from "./astradb";
const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;

export const getProducts = async () => {
  const client = await getAstraClient();
  const {data} = await client.get(
    `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/rows/`
  );
  return data;
};

export const getProduct = async (id: string) => {
  const client = await getAstraClient();
  const {data} = await client.get(
    `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/${id}`
  );
  return data;
};

export const trackSession = async(dateTime, account, productId, session_message) => {
    const client = await getAstraClient();
    const { status, data } = await client.post(
        `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/activity_stream`,
        {
        timestamp: dateTime,
        wallet_address: account,
        product_id: productId,
        action: session_message
    });
}