import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Css/AccountEdit.module.css';

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

const AccountEdit = () => {
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        currentPassword: '',
        newPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = parseJwt(token);
        if (!decoded?.userId) return;

        setIsLoading(true);
        axios.get(`http://localhost:8082/api/user/updateUser/${decoded.userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setFormData({
                    login: res.data.login || '',
                    email: res.data.email || '',
                    currentPassword: '',
                    newPassword: ''
                });
            })
            .catch(err => {
                console.error('Failed to fetch user data', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.login.trim()) {
            newErrors.login = 'Логин обязателен';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
            isValid = false;
        }

        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'Минимум 6 символов';
                isValid = false;
            }
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Введите текущий пароль';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const userId = parseJwt(token)?.userId;
        if (!userId) return;

        setIsLoading(true);
        try {
            await axios.put(
                `http://localhost:8082/api/user/updateUser/${userId}`,
                {
                    login: formData.login,
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        } catch (err) {
            console.error('Update failed:', err);
            setErrors({
                ...errors,
                currentPassword: err.response?.data?.message || 'Ошибка обновления'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Редактирование аккаунта</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Логин</label>
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.login ? styles.errorBorder : ''}`}
                    />
                    {errors.login && <span className={styles.errorText}>{errors.login}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.email ? styles.errorBorder : ''}`}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Текущий пароль</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.currentPassword ? styles.errorBorder : ''}`}
                        placeholder="Обязательно для смены пароля"
                    />
                    {errors.currentPassword && (
                        <span className={styles.errorText}>{errors.currentPassword}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Новый пароль</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.newPassword ? styles.errorBorder : ''}`}
                        placeholder="Оставьте пустым, если не меняете"
                    />
                    {errors.newPassword && (
                        <span className={styles.errorText}>{errors.newPassword}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>

                {isSuccess && (
                    <div className={styles.successMessage}>
                        Данные успешно обновлены!
                    </div>
                )}
            </form>
        </div>
    );
};

export default AccountEdit;