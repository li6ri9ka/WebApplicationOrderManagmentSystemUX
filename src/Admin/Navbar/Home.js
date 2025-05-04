import React from 'react';
import styles from '../Css/NavbarCss/Home.module.css';

const Home = () => {
    return (
        <div className={styles['home-container']}>
            <h1 className={styles['home-title']}>Добро пожаловать в систему управления заказами</h1>
            <p className={styles['home-description']}>Здесь вы можете управлять клиентами, продуктами и заказами.</p>
            <div className={styles['home-image-container']}>
                <img
                    src="https://via.placeholder.com/400"
                    alt="Система управления"
                    className={styles['home-image']}
                />
            </div>
        </div>
    );
};

export default Home;