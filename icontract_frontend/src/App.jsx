import { Routes, Route } from "react-router-dom"
import './App.css'
//import MainPage from './elementsPages/MainPage'
import {AppDataProvider} from './Context/AppContext'
import MainPage from "./Landingpage/MainPage"
import HomePage from "./IDE/HomePage"
import CreatePage from "./IDE/CreatePage"
import SideBar from "./IDE/SideBar"
import AboutPage from "./Landingpage/AboutPage"
import PricingPage from "./Landingpage/PricingPagge"


function App() {

  return (
    <AppDataProvider>
    <Routes>
    <Route path="/" element={ <MainPage/> } />
    <Route path="/IDE" element={ <HomePage/> } />
    <Route path="/create" element={ <CreatePage/> } />
    <Route path="/test" element={ <SideBar/> } />
    <Route path="/about" element={ <AboutPage/> } />
    <Route path="/pricing" element={ <PricingPage/> } />

  </Routes>
    </AppDataProvider>
  )
}

export default App
