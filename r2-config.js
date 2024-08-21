const AWS = require('aws-sdk');

const r2 = new AWS.S3({
  endpoint: 'https://<account_id>.r2.cloudflarestorage.com',  // Replace <account_id> with your Cloudflare account ID
  accessKeyId: process.env.R2_ACCESS_KEY,  // Store your R2 Access Key securely
  secretAccessKey: process.env.R2_SECRET_KEY,  // Store your R2 Secret Key securely
  region: 'auto',
  signatureVersion: 'v4',
});

const BUCKET_NAME = '<your_bucket_name>'; // Replace with your R2 bucket name

module.exports = { r2, BUCKET_NAME };
