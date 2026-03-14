const express=require('express');
const multer = require('multer');
const { uploadFile,getFiles,deleteFile } = require('../controllers/cloudlogic');
const { generateDownloadLink } = require('../controllers/generateSASDownloadLink');
const upload = require('../middleware/upload');

const router = express.Router();

const singleFileUpload = (req, res, next) => {
	upload.single("file")(req, res, (err) => {
		if (!err) {
			return next();
		}

		if (err instanceof multer.MulterError) {
			if (err.code === "MISSING_FIELD_NAME" || err.message === "Field name missing") {
				return res.status(400).json({
					error: "Invalid multipart form-data: missing file field name. Use field name 'file'."
				});
			}

			return res.status(400).json({ error: err.message });
		}

		return next(err);
	});
};

router.post("/upload", singleFileUpload, uploadFile);
router.get("/",getFiles);
router.delete("/:id", deleteFile);
router.get("/download/:id", generateDownloadLink);

module.exports = router;