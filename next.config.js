/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    AWS_S3: "https://dscrypto.s3.amazonaws.com/",
    ACCESSKEYID:"AKIAQPC7PIK3MBYRMQI4",
    SECRETACCESSKEY:"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",
    S3_BUCKET :"dscrypto",
    REGION: "us-east-1",
  },
}

module.exports = nextConfig
