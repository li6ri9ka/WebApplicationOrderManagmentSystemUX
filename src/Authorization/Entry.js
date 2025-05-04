import React, { useState } from "react";
import styles from "./AuthorizationCss/Entry.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!login || !password) {
            setError("Пожалуйста, заполните все поля");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8082/api/auth/login", {
                login,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);

            navigate("/");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Неверный логин или пароль");
            } else {
                setError("Ошибка при авторизации");
            }
        }
    };

    const handleRegisterClick = () => {
        navigate("/registration");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>Авторизация</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.field}>
                        <label className={styles.label}>Логин</label>
                        <input
                            type="text"
                            placeholder="Введите ваш логин"
                            className={styles.input}
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Пароль</label>
                        <input
                            type="password"
                            placeholder="Введите ваш пароль"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.submitButton}>
                            Войти
                        </button>
                    </div>

                    <div className={styles.footer}>
                        <span className={styles.footerText}>Нет аккаунта?</span>
                        <button
                            type="button"
                            className={styles.linkButton}
                            onClick={handleRegisterClick}
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
