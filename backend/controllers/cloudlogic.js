const File = require('../models/File');
const blobServiceClient = require('../services/azureStorage');
const uploadFile = async (req, res) => {

  try {

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        error: "No file received. Send multipart/form-data with field name 'file'."
      });
    }

    const containerClient =
      blobServiceClient.getContainerClient("files");

    const blobName = Date.now() + "-" + file.originalname;

    const blockBlobClient =
      containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer);

    const blobUrl = blockBlobClient.url;

    const savedFile = await File.create({
      fileName: file.originalname,
      blobName: blobName,
      blobUrl: blobUrl,
      size: file.size,
      mimeType: file.mimetype
    });

    res.json({
      message: "File uploaded successfully",
      file: savedFile
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFiles = async (req, res) => {
	try{
		const files = await File.find().sort({ uploadedAt: -1 });
		if(files.length === 0){
			return res.status(404).json({ message: "No files found" });
		}
		res.json(files);
	}
	catch(error){
		console.log("Error "+error.message);
		res.status(500).json({ error: error.message });
	}
};

const deleteFile = async (req, res) => {
  try {
	const fileId = req.params.id;
	const file = await File.findById(fileId);
	if (!file) {
	  return res.status(404).json({ message: "File not found" });
	}	
	const containerClient = blobServiceClient.getContainerClient("files");
	const blockBlobClient = containerClient.getBlockBlobClient(file.blobName);
	await blockBlobClient.delete();
	await File.findByIdAndDelete(fileId);
	res.json({ message: "File deleted successfully" });
	  } catch (error) {
	res.status(500).json({ error: error.message });
	  }
}

module.exports = { uploadFile ,getFiles, deleteFile};