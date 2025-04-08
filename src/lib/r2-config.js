const AWS = require('aws-sdk');

// Get environment variables
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY;
const SECRET_KEY = process.env.R2_SECRET_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Validate required environment variables
if (!ACCOUNT_ID) {
  console.error('R2_ACCOUNT_ID environment variable is required');
}
if (!ACCESS_KEY) {
  console.error('R2_ACCESS_KEY environment variable is required');
}
if (!SECRET_KEY) {
  console.error('R2_SECRET_KEY environment variable is required');
}
if (!BUCKET_NAME) {
  console.error('R2_BUCKET_NAME environment variable is required');
}

// Initialize R2 client
const r2 = new AWS.S3({
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: 'auto',
  signatureVersion: 'v4',
});

// Export configuration
module.exports = { 
  r2, 
  BUCKET_NAME,
  getPublicUrl: (filePath) => `https://${BUCKET_NAME}.${ACCOUNT_ID}.r2.dev/${filePath}`
};
