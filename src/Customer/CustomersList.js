import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../CustomerCss/CustomerList.module.css';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = () => {
        axios.get('http://localhost:8082/api/customers')
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

        axios.delete(`http://localhost:8082/api/customers/deleteCustomer/${id}`)
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
            <button
                className={styles.addButton}
                onClick={() => navigate('/newCustomer')}
            >
                ➕ Добавить клиента
            </button>

            <ul className={styles.customerUl}>
                {customers.map(customer => (
                    <li key={customer.id} className={styles.customerItem}>
                        <div className={styles.customerInfo}>
                            <div className={styles.customerDetails}>
                                <strong>{customer.id}. {customer.name_customer}</strong>
                                <span>Логин: {customer.login_customer}</span>
                                <span>Пароль: {customer.password_customer}</span>
                            </div>
                            <div className={styles.actionButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() => navigate(`/updateCustomer/${customer.id}`)}
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