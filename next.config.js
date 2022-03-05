/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    AWS_S3: "https://dscrypto.s3.amazonaws.com/",
    ACCESSKEYID:"AKIAQPC7PIK3MBYRMQI4",
    SECRETACCESSKEY:"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",
    S3_BUCKET :"dscrypto",
    REGION: "us-east-1",

  //   ASTRA_DB_URL:"https://0c34058c-a433-49fc-97df-8e3418171dbc-us-east1.apps.astra.datastax.com/api/rest/v2/keyspaces/demoks",
  //   ASTRA_DB_ID:"0c34058c-a433-49fc-97df-8e3418171dbc",
  //   ASTRA_DB_REGION:"us-east1",
  //   ASTRA_DB_KEYSPACE:"demoks",
  //   ASTRA_DB_APPLICATION_TOKEN:"AstraCS:dBIexMdAMEqYoqjqFWaJSDiF:5d36a5226683c0fa63a4ea59b53a75442784b4e0d26ba486b8b0f0eafd577b66"
  },
}

module.exports = nextConfig
