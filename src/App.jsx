import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import NutritionSummaryPage from "./pages/NutritionSummaryPage";
import SummaryDataPage from "./pages/SummaryDataPage";
import MenuPage from "./pages/MenuPage";
import SugarLevel from "./pages/SugarLevelPage";
import PersonalPage from "./pages/PersonalPage";
import Login from "./pages/Login";
import FootExaminationPage from "./pages/FootExaminationPage";
import FoodLogPage from "./pages/FoodLogPage";
import MealPage from "./pages/MealPage";
import RiceFlourPage from "./pages/RiceFlourPage";
import VegetablePage from "./pages/VegetablePage";
import FruitPage from "./pages/FruitPage";
import MedicationPage from "./pages/MedicationPage";
import DairyPage from "./pages/DairyPage";
import MeatPage from "./pages/MeatPage";
import SingleDishPage from "./pages/SingleDishPage";
import DessertPage from "./pages/DessertPage";
import FatPage from "./pages/FatPage";

import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/summary" element={<NutritionSummaryPage />} />
        <Route path="/summary-data" element={<SummaryDataPage />} />
        <Route path="/sugar-level" element={<SugarLevel />} />
        <Route path="/personal" element={<PersonalPage />} />
        <Route path="/foot-exam" element={<FootExaminationPage />} />
        <Route path="/food-log" element={<FoodLogPage />} />
        <Route path="/meal" element={<MealPage />} />
        <Route path="/food/rice-flour" element={<RiceFlourPage />} />
        <Route path="/food/vegetable" element={<VegetablePage />} />
        <Route path="/medication" element={<MedicationPage />} />
        <Route path="/food/fruit" element={<FruitPage />} />
        <Route path="/food/dairy" element={<DairyPage />} />
        <Route path="/food/meat" element={<MeatPage />} />
        <Route path="/food/single-dish" element={<SingleDishPage />} />
        <Route path="/food/dessert" element={<DessertPage />} />
        <Route path="/food/fat" element={<FatPage />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
