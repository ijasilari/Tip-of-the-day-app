import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ButtonAppBar from "./ButtonAppBar";
import HomePage from "./HomePage";
import AddTip from "./AddTip";
import ViewTips from "./ViewTips";

function App() {

 return (
   <BrowserRouter>
     <ButtonAppBar />
     <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="addtip" element={<AddTip />} />
       <Route path="viewtips" element={<ViewTips />} />
       <Route path="*" element={<HomePage />} />
     </Routes>
   </BrowserRouter>
 );
}

export default App;
