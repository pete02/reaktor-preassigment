import axios from "axios"
import fs, { readSync } from "fs";
import xml2js from "xml2js"
import express from "express";
const app=express()

app.get("/",(req,res)=>{
    res.json(JSON.parse(fs.readFileSync("./db.json")))
})

app.listen(3000)

var parser = new xml2js.Parser();
let drones

function distance(drone){
    let x=250000-drone.positionX[0]
    let y=250000-drone.positionY[0]
    drone.distance=Math.sqrt((x*x)+(y*y))
    return drone
}

async function get_owner_data(serialNumber){
   let owner=
    axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`).then(r=>{
        owner=r.data
        return owner
    }).catch(e=>{
        console.log(e)
        owner=null
    })
    return owner
}

async function write_data(d){
    const owner= await get_owner_data(d.serialNumber)
    console.log(owner)
    let db
    if(fs.existsSync('./db.json')){
        db=JSON.parse(fs.readFileSync("./db.json"))
    }else{
        db=[]
    }
    db=db.filter(a=>Date.now()-a.timestamp<600000)
    db.push({"drone":d,"owner":owner,"timestamp":Date.now()})
    return fs.writeFileSync("./db.json",JSON.stringify(db))
}

function get_drones(){

    axios.get("http://assignments.reaktor.com/birdnest/drones").then(r=>{
    parser.parseString(r.data, async function (err, result) {
        drones=result.report.capture[0].drone
        drones=drones.map(d=>distance(d))
        drones=drones.filter(d=>d.distance<=100000)
        drones=drones.map(async d=>{
            write_data(d)
        })
    })
    }).catch(e=>{
        console.log("error in getting drone data")
    })
}


setInterval(function(){get_drones()},2000)

