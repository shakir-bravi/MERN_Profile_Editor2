import { app } from "./app.js";
import { DBConnection } from "./db/connection.db.js";
import dotenv from "dotenv"

dotenv.config({path:".env"})

let port = process.env?.PORT || 2 ; 

DBConnection()
.then( ()=>{
    app.listen(port , ()=>{
        console.log(`=> App is Listening On http://localhost:${port}`);  
    })
})
.catch( (error)=>{
    console.log(" : )  Error on index.js :: 16" , error);
    
})
