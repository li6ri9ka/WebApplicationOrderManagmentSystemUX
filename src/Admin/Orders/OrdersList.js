import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Css/OrderCss/OrderCss.module.css';

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

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchOrders(token);
    }, [navigate]);

    const fetchOrders = async (token) => {
        try {
            const parsedToken = parseJwt(token);
            const userId = parsedToken?.userId;
            const isAdmin = parsedToken?.role?.toUpperCase() === 'ADMIN';

            // Используем правильные эндпоинты
            const endpoint = isAdmin
                ? 'http://localhost:8082/api/orders'
                : `http://localhost:8082/api/orders/user/${userId}`;

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setOrders(response.data);
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
            setError(error.response?.data?.message || 'Ошибка загрузки заказов');

            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить заказ?');
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');
        const parsedToken = parseJwt(token);
        const isAdmin = parsedToken?.role?.toUpperCase() === 'ADMIN';

        axios.delete(`http://localhost:8082/api/orders/deleteOrder/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setOrders(orders.filter(o => o.id !== id));
            })
            .catch((error) => {
                alert('Не удалось удалить заказ');
                console.error('Ошибка удаления:', error);
            });
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.orderList}>
            <h2 className={styles.title}>
                {orders.length > 0 ? 'Мои заказы' : 'Заказы не найдены'}
            </h2>
            <ul className={styles.orderUl}>
                {orders.map(order => (
                    <li key={order.id} className={styles.orderItem}>
                        <div className={styles.orderInfo}>
                            <div className={styles.orderDetails}>
                                <strong>Заказ №{order.id}</strong>
                                <div className={styles.orderMeta}>
                                    <span>Статус: <span className={styles[`status-${order.status_order?.toLowerCase()}`]}>
                                        {order.status_order}
                                    </span></span>
                                    <span>Сумма: {order.total_cost} руб.</span>
                                    <span>Дата: {new Date(order.orderCreated).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className={styles.actionButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(order.id)}
                                    title="Удалить заказ"
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;