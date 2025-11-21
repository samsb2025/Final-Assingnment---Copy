import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Logout from "./components/Logout";

import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./components/AdminPanel";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home.jsx";
import "./App.css";

function App() {
  const isAdmin = true;
  return (
    <BrowserRouter>
      <Navbar />
 <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="" element={<AdminPanel />} />
        </Route>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
