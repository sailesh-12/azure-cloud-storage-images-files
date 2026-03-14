const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema(
{
    fileName: {
        type: String,
        required: true
    },

    blobName: {
        type: String,
        required: true
    },

    blobUrl: {
        type: String,
        required: true
    },

    size: {
        type: Number
    },

    mimeType: {
        type: String
    },

    uploadedBy: {
        type: String
    },

    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports =  mongoose.model("File", fileSchema);