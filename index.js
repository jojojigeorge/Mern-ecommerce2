import express from "express"
import colors from "colors"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import productRouter from "./routes/productRoute.js"
import cors from "cors"

// rest object
const app=express()

// config dotenv
dotenv.config()

// middleware
app.use(express.json())
app.use(morgan('dev'))
// app.use(cors())

app.use(cors());
app.options('*', cors());

// routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/product',productRouter)

        
// connect mongodb
connectDB()



// rest api
app.get('/hello',(req,res)=>{
    res.send('<h1>welcome to ecomerce app2</h1>')
})

// port
const PORT =process.env.PORT||8080

// run listen
app.listen(PORT,()=>{
    console.log(`Server Running in ${PORT}`.blue)
})

// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server Running in ${PORT}`.pink)
//     })
// })