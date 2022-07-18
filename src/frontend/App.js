import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Spinner } from "react-bootstrap";

import './App.css';
import { TransactionContext } from "./context/TransactionContext";
import Navigation from "./components/Navbar";
import Home from "./containers/Home";

const App = () => {
  const { isLoading } = useContext(TransactionContext);

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Navigation />
          {
            isLoading ? (
              <div style={{ display: "flex", justifyContent: 'center', alignItems: "center", minHeight: '80vh' }}>
                <Spinner animation="border" style={{ display: "flex" }} />
                <p className="mx-3 my-9">Please wait</p>
              </div>
            ) : (

              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            )
          }
        </div>
      </BrowserRouter>
    </>
  )
}

export default App;