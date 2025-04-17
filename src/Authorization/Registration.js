import React from "react";
import styles from "../AuthorizationCss/Registration.module.css";
import {useNavigate} from "react-router-dom";

const RegisterForm = () => {
    const navigate = useNavigate();
    const handleRegisterClick = () => {
        navigate("/entry");
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>Регистрация</h1>

                <form className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Имя</label>
                        <input
                            type="text"
                            placeholder="Введите ваше имя"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Логин</label>
                        <input
                            type="text"
                            placeholder="Придумайте логин"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Пароль</label>
                        <input
                            type="password"
                            placeholder="Придумайте пароль"
                            className={styles.input}
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
                            onClick={handleRegisterClick}
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