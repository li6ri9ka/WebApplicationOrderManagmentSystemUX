import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Entry from "./Authorization/Entry";
import Navigation from './Admin/Navbar/Navigation';
import Home from './Admin/Navbar/Home';
import CustomersList from './Admin/Customer/CustomersList';
import UpdateCustomer from './Admin/Customer/UpdateCustomer';
import DeleteCustomer from './Admin/Customer/DeleteCustomer';
import ProductList from './Admin/Product/ProductsList';
import CreateProduct from './Admin/Product/CreateProduct';
import UpdateProduct from './Admin/Product/UpdateProduct';
import OrderList from './Admin/Orders/OrdersList';
import Registration from "./Authorization/Registration";
import Cart from "./User/Cart/Cart";
import AccountEdit from "./User/AccountEdit/AccountEdit";
import { CartProvider } from './Context/CartContext';

function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/entry' || location.pathname === '/registration';

    const token = localStorage.getItem('token');

    return (
        <CartProvider>
            {!isAuthPage && token && <Navigation />}
            <div style={{ padding: isAuthPage ? 0 : '1rem' }}>
                <Routes>
                    <Route path="/entry" element={<Entry />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/" element={token ? <Home /> : <Navigate to="/entry" />} />
                    <Route path="/customers" element={token ? <CustomersList /> : <Navigate to="/entry" />} />
                    <Route path="/updateUser/:id" element={token ? <UpdateCustomer /> : <Navigate to="/entry" />} />
                    <Route path="/delete/:id" element={token ? <DeleteCustomer /> : <Navigate to="/entry" />} />
                    <Route path="/products" element={token ? <ProductList /> : <Navigate to="/entry" />} />
                    <Route path="/newProduct" element={token ? <CreateProduct /> : <Navigate to="/entry" />} />
                    <Route path="/updateProduct/:id" element={token ? <UpdateProduct /> : <Navigate to="/entry" />} />
                    <Route path="/orders" element={token ? <OrderList /> : <Navigate to="/entry" />} />
                    <Route path="/cart" element={token ? <Cart /> : <Navigate to="/entry" />} />
                    <Route path="/account" element={token ? <AccountEdit /> : <Navigate to="/entry" />} />
                </Routes>
            </div>
        </CartProvider>
    );
}

export default App;
