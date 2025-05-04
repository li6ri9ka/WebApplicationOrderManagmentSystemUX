import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Css/CustomerCss/CustomerList.module.css';

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

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const parsedToken = parseJwt(token);
        const role = parsedToken?.role?.toUpperCase();

        if (role !== 'ADMIN') {
            navigate('/'); // редиректим, если не админ
            return;
        }

        fetchCustomers(token);
    }, [navigate]);

    const fetchCustomers = (token) => {
        axios.get('http://localhost:8082/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setCustomers(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Ошибка загрузки клиентов');
                setLoading(false);
                console.error('Ошибка:', error);
            });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить клиента?');
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');

        axios.delete(`http://localhost:8082/api/user/deleteUser/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setCustomers(customers.filter(c => c.id !== id));
            })
            .catch((error) => {
                alert('Не удалось удалить клиента');
                console.error('Ошибка удаления:', error);
            });
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.customerList}>
            <h2 className={styles.title}>Клиенты</h2>
            <ul className={styles.customerUl}>
                {customers.map(customer => (
                    <li key={customer.id} className={styles.customerItem}>
                        <div className={styles.customerInfo}>
                            <div className={styles.customerDetails}>
                                <strong>ID: {customer.id}</strong>
                                <span>Логин: {customer.login}</span>
                                <span>Email: {customer.email}</span>
                            </div>
                            <div className={styles.actionButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() => navigate(`/updateUser/${customer.id}`)}
                                    title="Редактировать клиента"
                                >
                                    ✏️
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(customer.id)}
                                    title="Удалить клиента"
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

export default CustomerList;
