import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../CustomerCss/CreateCustomer.module.css';

const CreateCustomer = () => {
    const [customer, setCustomer] = useState({
        name_customer: '',
        login_customer: '',
        password_customer: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("http://localhost:8082/api/customers/newCustomer", customer)
            .then(() => {
                alert('Новый клиент успешно создан');
                navigate('/customers');
            })
            .catch((error) => {
                setError(error.response?.data?.message || 'Ошибка при создании клиента');
                setLoading(false);
            });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Создать нового клиента</h1>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Имя клиента</label>
                    <input
                        type="text"
                        name="name_customer"
                        value={customer.name_customer}
                        onChange={handleChange}
                        className={styles.input}
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Логин</label>
                    <input
                        type="text"
                        name="login_customer"
                        value={customer.login_customer}
                        onChange={handleChange}
                        className={styles.input}
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Пароль</label>
                    <input
                        type="password"
                        name="password_customer"
                        value={customer.password_customer}
                        onChange={handleChange}
                        className={styles.input}
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => navigate('/customers')}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Создание...' : 'Создать клиента'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCustomer;