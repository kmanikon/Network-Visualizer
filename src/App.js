import React, { } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlowPage from './pages/FlowPage';
import './App.css';


function App() {
  return (
    <div className="App">
      <div style={{height: 58, width: '100%', backgroundColor: 'purple', paddingBottom: 2}}>
        <div style={{
            width: '100%', 
            height: '100%', 
            color: 'whitesmoke', 
            fontFamily: 'cursive', 
            fontSize: 30,
            fontWeight: 520,  
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}
        >
          pickle
        </div>
      </div>
      <div 
        style={{
          height: 'calc(100vh - 60px)', 
          //width: 'calc(100vw - 320px)'
          }}
        >
        <Router>
          <Routes>
            <Route path="/" element={<FlowPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
