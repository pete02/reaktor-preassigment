import express from "express";
import fs from "fs";
import cors from 'cors'
import { get_drones } from "./drones.js";

const app=express()
app.use(cors())

//serve backend
app.get("/",(req,res)=>{
    if(fs.existsSync("./db.json")){
        res.json(JSON.parse(fs.readFileSync("./db.json")))
    }else{
        res.json([{}])
    }
    
})

app.listen(3000)

//call drone data fetch function every 2 seconds
setInterval(()=>get_drones(),2000)

