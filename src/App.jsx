import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import NutritionSummaryPage from "./pages/NutritionSummaryPage";
import SummaryDataPage from "./pages/SummaryDataPage";
import MenuPage from "./pages/MenuPage";

import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/summary" element={<NutritionSummaryPage />} />
        <Route path="/summary-data" element={<SummaryDataPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
