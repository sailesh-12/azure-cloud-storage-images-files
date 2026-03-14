const {generateBlobSASQueryParameters,BlobSASPermissions,StorageSharedKeyCredential}=require('@azure/storage-blob');
const File = require('../models/File');
const sharedKeyCredential = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_KEY
);

const generateDownloadLink = async (req, res) => {

  try {

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + 10);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: process.env.AZURE_CONTAINER_NAME,
        blobName: file.blobName,
        permissions: BlobSASPermissions.parse("r"),
        expiresOn
      },
      sharedKeyCredential
    ).toString();

    const url = `${file.blobUrl}?${sasToken}`;

    res.json({
      downloadUrl: url
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateDownloadLink };