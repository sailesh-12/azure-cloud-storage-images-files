const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

module.exports =  blobServiceClient;