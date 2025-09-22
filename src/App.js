import React, { useState } from "react";
import { Button, IconButton, Snackbar } from "@mui/joy";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { GrUndo, GrRedo } from "react-icons/gr";
import FlowPage from "./pages/FlowPage";
import "./App.css";

function App() {
 
  const [open, setOpen] = useState(false);

  const handleExport = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setOpen(true); // show snackbar
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="App">
      <div
        style={{
          height: 58,
          width: "100%",
          backgroundColor: "purple",
          paddingBottom: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              color: "whitesmoke",
              fontFamily: "cursive",
              fontSize: 30,
              fontWeight: 520,
            }}
          >
            Churro
          </div>
          <div
            style={{
              position: "absolute",
              right: 20,
              display: "flex-end",
              color: "whitesmoke",
              display: 'flex',
              alignItems: 'center',
              gap: 20
            }}
          >

            <div style={{display: 'flex', gap: 5}}>
            <IconButton 
              className="nav-btn"
              style={{
                backgroundColor: 'transparent', 
                color: "whitesmoke"
              }}
              onClick={() => {
                window.history.back()
              }}
              disabled
            >
              <GrUndo variant="plain" fontSize={22}/>
            </IconButton>

            <IconButton 
              className="nav-btn" 
              style={{
                backgroundColor: 'transparent', 
                color: "whitesmoke"
              }}
              onClick={() => {
                window.history.forward()
              }}
              disabled
            >
              <GrRedo variant="plain" fontSize={22} />
            </IconButton>
            </div>
            
            <Button variant="solid" onClick={handleExport}>
              Export Workflow
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "calc(100vh - 60px)",
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<FlowPage />} />
          </Routes>
        </Router>
      </div>

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        color="success"
        variant="soft"
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <FiCheckCircle/>
        Workflow URL copied to clipboard!
      </Snackbar>
    </div>
  );
}

export default App;
