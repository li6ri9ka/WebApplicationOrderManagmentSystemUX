import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../CustomerCss/UpdateCustomer.module.css';

const UpdateCustomer = () => {
    const [customer, setCustomer] = useState({
        name_customer: '',
        login_customer: '',
        password_customer: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8082/api/customers/updateCustomer/${id}`)
            .then((response) => {
                setCustomer(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Не удалось загрузить данные клиента');
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8082/api/customers/updateCustomer/${id}`, customer)
            .then(() => {
                alert('Клиент успешно обновлен');
                navigate('/customers');
            })
            .catch(() => setError('Не удалось обновить клиента'));
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.updateContainer}>
            <h1 className={styles.title}>Обновить клиента</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Имя клиента</label>
                    <input
                        type="text"
                        name="name_customer"
                        value={customer.name_customer}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Логин</label>
                    <input
                        type="text"
                        name="login_customer"
                        value={customer.login_customer}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Пароль</label>
                    <input
                        type="password"
                        name="password_customer"
                        value={customer.password_customer}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => navigate('/customers')}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                    >
                        Обновить данные
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateCustomer;