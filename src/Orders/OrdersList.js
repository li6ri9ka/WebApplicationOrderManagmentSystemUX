import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../OrderCss/OrderCss.module.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios.get('http://localhost:8082/api/orders')
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Ошибка загрузки заказов');
                setLoading(false);
                console.error('Ошибка загрузки:', error);
            });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить заказ?');
        if (!confirmDelete) return;

        axios.delete(`http://localhost:8082/api/orders/deleteOrder/${id}`)
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
            <h2 className={styles.title}>Заказы</h2>

            <div className={styles.topButtons}>
                <button
                    className={styles.addButton}
                    onClick={() => navigate('/newOrder')}
                >
                    ➕ Добавить заказ
                </button>
            </div>

            <ul className={styles.orderUl}>
                {orders.map(order => (
                    <li key={order.id} className={styles.orderItem}>
                        <div className={styles.orderInfo}>
                            <div className={styles.orderDetails}>
                                <strong>Заказ №{order.id}</strong>
                                <div className={styles.orderMeta}>
                                    <span>Количество: {order.quantity}</span>
                                    <span>Статус: <span className={styles[`status-${order.status_order.toLowerCase()}`]}>{order.status_order}</span></span>
                                    <span>Сумма: {order.total_cost} руб.</span>
                                    <span>Дата: {new Date(order.orderCreated).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className={styles.actionButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() => navigate(`/updateOrder/${order.id}`)}
                                    title="Редактировать заказ"
                                >
                                    ✏️
                                </button>
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