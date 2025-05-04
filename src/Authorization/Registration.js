import React, { useState } from "react";
import styles from "./AuthorizationCss/Registration.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!email || !login || !password) {
            setError("Пожалуйста, заполните все поля");
            return;
        }

        const user = {
            login,
            password,
            email
        };

        try {
            const response = await axios.post("http://localhost:8082/api/auth/register", user);
            if (response.status === 201) {
                navigate("/entry");
            }
        } catch (err) {
            if (err.response) {
                setError("Ошибка при регистрации: " + err.response.data);
            } else {
                setError("Произошла ошибка при связи с сервером.");
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>Регистрация</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleRegister}>
                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="text"
                            placeholder="Введите ваш Email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Логин</label>
                        <input
                            type="text"
                            placeholder="Придумайте логин"
                            className={styles.input}
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Пароль</label>
                        <input
                            type="password"
                            placeholder="Придумайте пароль"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.submitButton}>
                            Зарегистрироваться
                        </button>
                    </div>

                    <div className={styles.footer}>
                        <span className={styles.footerText}>Уже есть аккаунт?</span>
                        <button
                            type="button"
                            className={styles.linkButton}
                            onClick={() => navigate("/entry")}
                        >
                            Войти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
