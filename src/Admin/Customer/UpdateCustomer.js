import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../Css/CustomerCss/UpdateCustomer.module.css';

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

const UpdateCustomer = () => {
    const [user, setUser] = useState({
        id: '',
        login: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();
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
            navigate('/');
            return;
        }

        // Добавляем токен в заголовок для авторизации
        axios.get(`http://localhost:8082/api/user/updateUser/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    setError('У вас нет прав для доступа к этим данным');
                    navigate('/');
                } else {
                    setError('Не удалось загрузить данные клиента');
                }
                setLoading(false);
            });
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');


        axios.put(`http://localhost:8082/api/user/updateUser/${id}`, user, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                alert('Данные клиента успешно обновлены');
                navigate('/customers');
            })
            .catch(() => setError('Не удалось обновить данные клиента'));
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.updateContainer}>
            <h1 className={styles.title}>Обновить клиента</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Логин</label>
                    <input
                        type="text"
                        name="login"
                        value={user.login}
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
