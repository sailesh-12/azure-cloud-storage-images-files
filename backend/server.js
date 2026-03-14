const express=require('express');
const app=express();
const cors=require('cors');
const connectDB=require('./config/dbConnection');
const uploadRoutes=require('./routes/uploadRoutes');
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/api/files',uploadRoutes);
// Connect to MongoDB
connectDB();
app.get('/health',(req,res)=>{
	res.status(200).json({
		message:"Json"
	});
});



app.listen(PORT,()=>{
	console.log(`SERVER is running on PORT ${PORT}`);
})