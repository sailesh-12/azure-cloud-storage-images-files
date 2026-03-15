const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let retryTimer = null;

const connectDB = async () => {
	try {
		console.log('Connecting to MongoDB...');
		await mongoose.connect(process.env.MONGO_DB_URL, {
			serverSelectionTimeoutMS: 10000,
		});
		console.log('MongoDB connected successfully');
		if (retryTimer) {
			clearTimeout(retryTimer);
			retryTimer = null;
		}
	} catch (error) {
		console.error('MongoDB connection error:', error);
		if (!retryTimer) {
			retryTimer = setTimeout(async () => {
				retryTimer = null;
				await connectDB();
			}, 15000);
		}
	}
};

module.exports = connectDB;