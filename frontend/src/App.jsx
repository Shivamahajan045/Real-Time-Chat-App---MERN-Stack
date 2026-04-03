import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
function App() {
  return (
    <div className="App">
      <Toaster placement="top-end" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
