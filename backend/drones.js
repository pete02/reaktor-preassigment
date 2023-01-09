import axios from "axios"
import fs, { readSync } from "fs";
import xml2js from "xml2js"

var parser = new xml2js.Parser();
let drones


//calculate given drone's distance from the birdnest
function distance(drone){
    let x=250000-drone.positionX[0]
    let y=250000-drone.positionY[0]
    let coordDist=Math.sqrt((x*x)+(y*y))
    drone.distance=Math.round(coordDist/1000)
    return drone
}

//fetch drone's owners data form given serial number
async function get_owner_data(serialNumber){
    let owner=axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`).then(r=>{
        return r.data
    }).catch(e=>{
        console.log(e)
        return null
    })

    return owner
}

//read data from db.json, remove all data older than 10 minutes,
//then update existing data and add new data.
//Then write current data to db.json
async function write_data(d){
    
    const owner= await get_owner_data(d.serialNumber)
    let db

    if(fs.existsSync('./db.json')){
        db=JSON.parse(fs.readFileSync("./db.json"))
    }else{
        db=[]
    }

    db=db.filter(a=>Date.now()-a.timestamp<600000)
    let exists=db.filter(dr=>dr.drone.serialNumber[0]==d.serialNumber[0])

    if(exists.length==0){
        db.push({"drone":d,"owner":owner,"timestamp":Date.now()})
    }
    else{
        exists.forEach(e => {
            db.splice(db.indexOf(e),1)
        });
        db.push({"drone":d,"owner":owner,"timestamp":Date.now()})
    }

    return fs.writeFileSync("./db.json",JSON.stringify(db))
}

//fetch data from the drones, then call distance calculator function,
//remove all drones that are further than 100m form the nest, then
//call write_data function for all drones
export function get_drones(){
    axios.get("http://assignments.reaktor.com/birdnest/drones").then(r=>{

    parser.parseString(r.data, async function (err, result) {
        drones=result.report.capture[0].drone
        drones=drones.map(d=>distance(d))
        drones=drones.filter(d=>d.distance<=100)
        drones=drones.map(async d=>{
            write_data(d)
        })
    })

    }).catch(e=>{
        console.log("error in getting drone data")
    })
    
}
