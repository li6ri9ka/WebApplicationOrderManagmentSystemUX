import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Entry from "./Authorization/Entry";
import Navigation from './Navbar/Navigation';
import Home from './Navbar/Home';
import CustomersList from './Customer/CustomersList';
import CreateCustomer from './Customer/CreateCustomer';
import UpdateCustomer from './Customer/UpdateCustomer';
import DeleteCustomer from './Customer/DeleteCustomer';
import ProductList from './Product/ProductsList';
import CreateProduct from './Product/CreateProduct';
import UpdateProduct from './Product/UpdateProduct';
import OrderList from './Orders/OrdersList';
import Registration from "./Authorization/Registration";

function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/entry' || location.pathname === '/registration';

    return (
        <>
            {!isAuthPage && <Navigation />}
            <div style={{ padding: isAuthPage ? 0 : '1rem' }}>
                <Routes>
                    <Route path="/entry" element={<Entry />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/customers" element={<CustomersList />} />
                    <Route path="/newCustomer" element={<CreateCustomer />} />
                    <Route path="/updateCustomer/:id" element={<UpdateCustomer />} />
                    <Route path="/delete/:id" element={<DeleteCustomer />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/newProduct" element={<CreateProduct />} />
                    <Route path="/updateProduct/:id" element={<UpdateProduct />} />
                    <Route path="/orders" element={<OrderList />} />
                </Routes>
            </div>
        </>
    );
}

export default App;