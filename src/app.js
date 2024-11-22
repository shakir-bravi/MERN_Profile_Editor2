import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// App Configuration

app.use(express.json({limit:"200kb"}))
app.use(express.urlencoded({limit:"200kb" , extended:true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors())


// Route Importing
import { router } from "./routes/user.route.js"

// Route Declaration
app.use("/api" ,router)


// app export
export{app}