const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = async () => {
	try {
		console.log('Connecting to MongoDB...');
		await mongoose.connect(process.env.MONGO_DB_URL);
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1); // Exit process with failure
	}
};

module.exports = connectDB;