import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./componants/pages/home";
import Booking from "./componants/pages/Booking";
import Checkout from "./componants/pages/chackout";
import Success from "./componants/pages/success";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/bus-book/:id" element={<Booking/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/success" element={<Success/>}/>
      </Routes>
    </>
  );
};

export default App;
