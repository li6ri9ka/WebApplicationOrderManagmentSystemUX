import React from "react";
import styles from "../AuthorizationCss/Entry.module.css";
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate(); // Получаем функцию навигации
    const handleRegisterClick = () => {
        navigate("/registration");
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>Авторизация</h1>

                <form className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Логин</label>
                        <input
                            type="text"
                            placeholder="Введите ваш логин"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Пароль</label>
                        <input
                            type="password"
                            placeholder="Введите ваш пароль"
                            className={styles.input}
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