import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Products from './components/Products';
import AddProducts from './components/AddProducts';
import Category from './components/Category';
import Updateproduct from './components/Updateproduct';
import Updatecategory from './components/Updatecategory';
import Addcategory from './components/Addcategory';
import PrivateRouter from './components/PrivateRouter';
import Users from './components/Users';
import AdminLogin from './components/Adminlogin';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route exact element={<PrivateRouter />}>
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/addproduct" element={<AddProducts />} />
            <Route path="/updateproduct/:id" element={<Updateproduct />} />
            <Route path="/updatecategory/:id" element={<Updatecategory />} />
            <Route path="/addcategory" element={<Addcategory />} />
            <Route path="/category" element={<Category />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
