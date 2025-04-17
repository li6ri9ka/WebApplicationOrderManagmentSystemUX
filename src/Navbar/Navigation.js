import React from 'react';
import { Link } from 'react-router-dom';
import '../NavbarCss/Navbar.module.css';

const Navigation = () => {
    return (
        <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
            <Link to="/" style={{ marginRight: '1rem' }}>Домой</Link>
            <Link to="/customers" style={{ marginRight: '1rem' }}>Клиенты</Link>
            <Link to="/products" style={{ marginRight: '1rem' }}>Продукты</Link>
            <Link to="/orders">Заказы</Link>
        </nav>
    );
};

export default Navigation;
