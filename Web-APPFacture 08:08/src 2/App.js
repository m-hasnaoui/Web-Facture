import { useEffect, useState } from "react";
import { Navigate, useNavigate, Routes, Route } from "react-router-dom";
import Sidebar from "./pages/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ReactSession } from "react-client-session";
import Topbar from "./pages/global/Topbar.jsx";

import Login from "./pages/Login.jsx";

import Welcome from "./pages/Welcome.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import User from "./pages/User.jsx";
import Societe from "./pages/Societe.jsx";
import Profile from "./pages/Profiles.jsx";
import Article from "./pages/Article.jsx";
import Client from "./pages/Client.jsx";
import Fournisseur from "./pages/Fournisseur.jsx";
import Transporteur from "./pages/Transporteur.jsx";
import Vehicle from "./pages/Vehicle.jsx";
import AVALNUM from "./pages/Compteur.jsx";
import ACODNUM from "./pages/Acodnum.jsx";
import Category from "./pages/Category.jsx";




function App() {
  const [theme, colorMode] = useMode();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSidebar, setIsSidebar] = useState(true);
  ReactSession.setStoreType("localStorage");
  const navigate = useNavigate();
  const username = ReactSession.get("username");

 const handleLogin = () => {
   if (username && username !== "") {
     setLoggedIn(true);
     navigate("/");
   } else {
     setLoggedIn(false);
     navigate("/login");
   }
 };

  useEffect(() => {
    // eslint-disable-next-line
    handleLogin();
    // eslint-disable-next-line
  }, [username]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {loggedIn ? (
            <>
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route
                    path="/"
                    element={
                      ReactSession.get("role") === "admin" ? (
                        <Dashboard />
                      ) : (
                        <Welcome />
                      )
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      loggedIn ? (
                        <Navigate to="/" />
                      ) : (
                        <Login onLogin={handleLogin} />
                      )
                    }
                  />
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Societe"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Societe"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/societe" element={<Societe />} />
                  ) : null}

                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Article"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Article"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/article" element={<Article />} />
                  ) : null}

                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Client"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Client"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/client" element={<Client />} />
                  ) : null}
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Fournisseur"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Fournisseur"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/fournisseur" element={<Fournisseur />} />
                  ) : null}

                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Transporteur"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Transporteur"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/transporteur" element={<Transporteur />} />
                  ) : null}

                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Camion"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Camion"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/camion" element={<Vehicle />} />
                  ) : null}
                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Compteur"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Compteur"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/compteur" element={<AVALNUM />} />
                  ) : null}

                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Acodnum"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Acodnum"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/acodnum" element={<ACODNUM />} />
                  ) : null}

                  {(ReactSession.get("visibility") &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Catégorie"
                    )[0] &&
                    ReactSession.get("visibility").filter(
                      (item) => item.page === "Catégorie"
                    )[0].visibility == 1) ||
                  ReactSession.get("role") === "admin" ? (
                    <Route path="/catégorie" element={<Category />} />
                  ) : null}

                  {ReactSession.get("role") == "admin" ? (
                    <Route path="/utilisateur" element={<User />} />
                  ) : null}
                  {ReactSession.get("role") == "admin" ? (
                    <Route path="/configuration" element={<Dashboard />} />
                  ) : null}
                  {ReactSession.get("role") == "admin" ? (
                    <Route path="/profile" element={<Profile />} />
                  ) : null}
                  {/* {ReactSession.get("role") == "admin" ? (
                    <Route path="/societe" element={<Societe />} />
                  ) : null} */}
                </Routes>
              </main>
            </>
          ) : (
            <main className="content">
              <Routes>
                <Route
                  path="/login"
                  element={<Login onLogin={handleLogin} />}
                />
                <Route path="/*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
