import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Emails from "./pages/Emails";
import CriticalMails from "./components/emails/CriticalMails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="emails" element={<Emails />} />
        </Route>
      </Routes>
      <CriticalMails />
    </BrowserRouter>
  );
}

export default App;
