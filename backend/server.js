const express=require('express');
const app=express();
const cors=require('cors');
const mongoose = require('mongoose');
const connectDB=require('./config/dbConnection');
const uploadRoutes=require('./routes/uploadRoutes');
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/api/files', (req, res, next) => {
	if (mongoose.connection.readyState !== 1) {
		return res.status(503).json({
			error: 'Database is temporarily unavailable. Please try again shortly.',
		});
	}
	next();
}, uploadRoutes);
app.get('/health',(req,res)=>{
	res.status(200).json({
		message:"OK",
		database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
	});
});

const startServer = async () => {
	app.listen(PORT,()=>{
		console.log(`SERVER is running on PORT ${PORT}`);
	});
	await connectDB();
};

startServer();