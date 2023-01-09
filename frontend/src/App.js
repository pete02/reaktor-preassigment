import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';



function App() {
  const [drones,setDrones]= useState([])
  const [num,setNum]=useState([])

  //after 2 seconds fetch data from backend, then call settumeout again
  useEffect(()=>{
    setTimeout(()=>{
      axios.get("http://localhost:3000").then(r=>{
        let tempdrones=r.data
        tempdrones.sort((a,b)=>a.drone.distance-b.drone.distance)
        setNum(tempdrones.length)
        setDrones(tempdrones)
    }).catch("error, backend did not respond")
    },2000)
  },[drones])

  //check, that the drone has an owner, if there is, return owner's contact data
  const get_owner=(d)=>{
    if(d.owner&& d.owner.firstName)
    return(<div>{d.owner.firstName+" "+d.owner.lastName}<br/>{d.owner.email}<br/>{d.owner.phoneNumber}</div>)
  }


  return (
    <div className="App">
      <header className="App-header">
        <div key={"tracking"}>
            tracking {num} drones
        </div>
          <table>
            <tbody>
            {drones.map(d=>{
            return(
            <tr key={d.timestamp}>
              <td>
                <div>Distance: {JSON.stringify(d.drone.distance)} m&nbsp;</div>
                <div>{new Date(d.timestamp).toTimeString().split("GMT+")[0]}</div>
              </td>
              <td>{get_owner(d)}</td>
            </tr>
            )})}
            </tbody>
          </table>
      </header>
    </div>
  );
}

export default App;
