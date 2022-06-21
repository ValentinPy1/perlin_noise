import './App.css';
import Canva from './Canva'
import React, { useState } from "react";

function App() {
  const [R_size, set_R_size] = useState(1);
  const [G_size, set_G_size] = useState(1);
  const [B_size, set_B_size] = useState(1);

  return (
    <div className="App">
        <Canva R_size={Math.sqrt(R_size)} G_size={Math.sqrt(G_size)} B_size={Math.sqrt(B_size)}></Canva>
        <input type="range" min="1" max="1000" value={R_size} class="slider" onChange={(e) => set_R_size(e.target.value)}></input>
        <input type="range" min="1" max="1000" value={G_size} class="slider" onChange={(e) => set_G_size(e.target.value)}></input>
        <input type="range" min="1" max="1000" value={B_size} class="slider" onChange={(e) => set_B_size(e.target.value)}></input>
    </div>
  );
}

export default App;
