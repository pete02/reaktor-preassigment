import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function get(){
  axios.get("http://localhost:3000").then(r=>{
    console.log(r.data)
  }).catch(e=>console.log("error"))
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
setInterval(() => {
  get()
}, 2000);
export default App;
