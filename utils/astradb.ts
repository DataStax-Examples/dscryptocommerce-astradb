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

export const trackSession = async(dateTime: string, account: string, productId: string, session_message: string) => {
    const client = await getAstraClient();
    const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
    const { status, data } = await client.post(
        `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/activity_stream`,
        {
        timestamp: dateTime,
        wallet_address: account,
        product_id: productId,
        action: session_message
    })
}

export const updateListNFT = async(productId: string, product_status: string, tokenid: string) => {
    const client = await getAstraClient();
    const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
    const { status, data } = await client.patch (
        `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/${productId}`,
        {
            product_status: product_status,
            tokenid: tokenid
        }
    );
    console.log("Update List Success!")
}

export const updateBidNFT = async(productId: string, product_status: string, account: string) => {
    const client = await getAstraClient();
    const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
    const { status, data } = await client.patch (
        `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/${productId}`,
        {
            product_status: product_status,
            buyer_address: account
        }
    );
    console.log("Update Bid Success!")
}

export const updateShipNFT = async(productId: string, product_status: string) => {
    const client = await getAstraClient();
    const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
    const { status, data } = await client.patch (
        `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/${productId}`,
        {
            product_status: product_status,
        }
    );
    console.log("Update Bid Success!")
}

export const updateReceiveNFT = async(productId: string, product_status: string) => {
    const client = await getAstraClient();
    const astraDatabaseKeyspace = process.env.NEXT_PUBLIC_ASTRA_DB_KEYSPACE;
    const { status, data } = await client.patch (
        `/api/rest/v2/keyspaces/${astraDatabaseKeyspace}/catalog/${productId}`,
        {
            product_status: product_status,
        }
    );
    console.log("Update Receive Success!")
}


