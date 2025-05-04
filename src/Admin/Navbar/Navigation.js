import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import styles from '../Css/NavbarCss/Navbar.module.css';

function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Ошибка парсинга токена', e);
        return null;
    }
}

const Navigation = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [role, setRole] = useState(null);
    const profileRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const parsedToken = parseJwt(token);
        const roleFromToken = parsedToken?.role?.toLowerCase();

        if (!roleFromToken) {
            console.warn('Роль не найдена в токене');
            navigate('/login');
            return;
        }

        setRole(roleFromToken);
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!role) return null;

    return (
        <nav className={styles.nav}>
            <div className={styles['nav-links']}>
                <Link className={styles.link} to="/">Домой</Link>
                {role === 'admin' && (
                    <Link className={styles.link} to="/customers">Клиенты</Link>
                )}
                <Link className={styles.link} to="/products">Продукты</Link>
                <Link className={styles.link} to="/orders">Заказы</Link>
            </div>

            <div className={styles['nav-icons']} ref={profileRef}>
                {role !== 'admin' && (
                    <Link className={styles.icon} to="/cart">
                        <FaShoppingCart />
                    </Link>
                )}

                <div className={styles.icon} onClick={() => setProfileOpen(prev => !prev)}>
                    <FaUserCircle />
                </div>

                {profileOpen && (
                    <div className={styles['profile-dropdown']}>
                        <Link to="/account">Изменить аккаунт</Link>
                        <Link to="/entry">Выход</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
