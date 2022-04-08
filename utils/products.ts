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