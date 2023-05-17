import React, { createContext } from "react";
import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthContext } from "./components/auth-context";
import ButtonAppBar from "./components/ButtonAppBar";
import HomePage from "./pages/HomePage";
import AddTip from "./pages/AddTip";
import ViewTips from "./pages/ViewTips";
import Authenticate from "./pages/Authenticate";
import "./App.css";
import ProfilePage from "./pages/ProfilePage";
import OwnTips from "./pages/OwnTips";

export const ThemeContext = createContext(null);

const queryClient = new QueryClient();
let logoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [userId, setuser] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(false);
  const [theme, setTheme] = useState("light");

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setuser(uid);

    const tokenExpirationDate =
    expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpirationDate.toISOString()
      })
    )
  },[]);

  const logout = useCallback(() => {
    setToken(null);
    setuser(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  },[]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);


  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  }

  let routes;
  if(token){
    routes = (
      <Routes>
        <Route path="/" element={<HomePage theme={theme}/>} />
        <Route path="/profilepage" element={<ProfilePage userId={userId} theme={theme}/>} />
        <Route path="addtip" element={<AddTip theme={theme}/>} />
        <Route path="viewtips" element={<ViewTips theme={theme}/>} />
        <Route path="owntips" element={<OwnTips theme={theme}/>} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    )
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<HomePage theme={theme}/>} />
        <Route path="viewtips" element={<ViewTips theme={theme}/>} />
        <Route path="auth" element={<Authenticate theme={theme}/>} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    )
  }

 return (

      <AuthContext.Provider
     value={{
       isLoggedIn: !!token,
       token: token,
       userId: userId,
       login: login,
       logout: logout,
     }}
   >
     <QueryClientProvider client={queryClient}>
       <BrowserRouter>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <ButtonAppBar toggleTheme={toggleTheme} theme={theme}/>
          {routes}
      </div>
    </ThemeContext.Provider>
   </BrowserRouter>
     </QueryClientProvider>
   </AuthContext.Provider>
 );
}

export default App;
