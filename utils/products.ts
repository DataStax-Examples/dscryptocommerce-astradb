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

export const addDraft = async (name: string, description: string, price: number, uid: uuid, account: string ) => {
  const client = await getAstraClient();
  const { status, data } = await client.post(
      `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/`,
      {
        "name": name,
        "description": description,
        "price": price,
        "product_status": "DRAFT",
        "product_id": uid,
        "seller_address": account
      }
  );
    console.log("addDraft Function Called!")
  return data;
};