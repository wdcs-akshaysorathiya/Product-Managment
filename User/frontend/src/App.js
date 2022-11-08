import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Singup from './components/Singup';
import PrivateRouter from './components/PrivateRouter';
import Cart from './components/Cart';
import { useState } from 'react';
import { GlobalContext } from './context/Globalcontext';
import ResetPassword from './components/ResetPassword';
import UserProfile from './components/UserProfile';

function App() {

  const [cartcounter, setCartcounter] = useState(localStorage.cartcounter ? JSON.parse(localStorage.cartcounter) : {});
  const setCountre = (data) => {
    setCartcounter(data)
    localStorage.setItem('cartcounter', JSON.stringify(data))
  }
  return (
    <>
      <GlobalContext.Provider value={
        {
          cartcounter,
          setCountre,
          // postData,
          // setPostDetail
        }
      }>

        <Router>
          <Routes>
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/singup" element={<Singup />} />
            <Route exact element={<PrivateRouter />}>
              <Route exact path="/home" element={<Home />} />
              <Route exact path="/userProfile" element={<UserProfile />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
          </Routes>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
