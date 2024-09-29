import "./App.css";
import React,{useState} from "react";
import AdminLogin from "./components/AdminLogin";
import SuperAdminLogin from "./components/SuperAdminLogin";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SuperAdminLogin />
    </>
  );
}

export default App;
