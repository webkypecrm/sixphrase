import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import './App.css'

import Loader from './components/Loader/Loader.jsx';
import Feature from './pages/Feature.jsx';
import AuthFeature from './pages/AuthFeature.jsx'
import { authRoutes, publicRoutes } from './pages/Router/router.link.jsx';
import PageNotFound from './pages/PageNotFound/PageNotFound.jsx'
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import SessionTimeout from './components/SessionTimeout/SessionTimeout.jsx';
import { SearchProvider } from './context/SearchProvider.jsx';
import { RefreshProvider } from './context/RefreshContaxt.jsx';
import GenerateOffer from './components/HRMS/GenerateOffer.jsx';
import GenerateNDA from './components/HRMS/GenerateNDA.jsx';
import SalarySlip from './pages/HRMS/SalarySlip.jsx';


function App() {


  useEffect(() => {
    // Disable right-click
    const disableRightClick = (event) => event.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    // Prevent screenshot shortcuts (PrtSc, Ctrl+S)
    const disableShortcuts = (event) => {
      if (event.key === "PrintScreen") {
        event.preventDefault();
        alert("Screenshots are disabled!");
      }
      if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        alert("Saving is disabled!");
      }
    };
    document.addEventListener("keydown", disableShortcuts);

    // Remove event listeners on component unmount
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableShortcuts);
    };
  }, [])


  return (
    <RefreshProvider>
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Loader />
          {/* <SessionTimeout /> */}

          <Routes>
            <Route element={

              // <ProtectedRoute>

              <Feature />

              // </ProtectedRoute>

            }>
              {publicRoutes.map((route, idx) => (
                <Route path={route.path} element={route.element} key={idx} />
              ))}
            </Route>

            <Route path={"/"} element={<AuthFeature />}>
              {authRoutes.map((route, idx) => (
                <Route path={route.path} element={route.element} key={idx} />
              ))}
              
            </Route>
            <Route path={"/hrms/generate-offer-latter/:id"}element={<GenerateOffer/>} />
            <Route path={"/hrms/generate-NDA/:id"}element={<GenerateNDA/>} />
            <Route path={"/hrms/salary-slip"}element={<SalarySlip/>} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
    </RefreshProvider>
  )
}

export default App
