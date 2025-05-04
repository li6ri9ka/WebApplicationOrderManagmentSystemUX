import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Css/Cart.module.css';
import { CartContext } from '../../Context/CartContext';

// Функция для парсинга JWT токена
const parseJwt = (token) => {
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
};

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Проверка авторизации при загрузке
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = parseJwt(token);
        if (!decodedToken) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    // Расчет общей суммы с защитой от undefined
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item?.price ? Number(item.price) : 0;
            const quantity = item?.quantity ? Number(item.quantity) : 0;
            return total + (price * quantity);
        }, 0);
    };

    // Оформление заказа с проверкой токена
    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Проверяем токен
            const decodedToken = parseJwt(token);
            if (!decodedToken) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            // Проверяем наличие обязательных полей
            const validItems = cartItems.filter(item =>
                item?.id && item?.price && item?.quantity && item?.name
            );

            if (validItems.length !== cartItems.length) {
                throw new Error('Некоторые товары содержат неполные данные');
            }

            const orderData = {
                items: validItems.map(item => ({
                    productId: Number(item.id),
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                    name: String(item.name),
                })),
                totalPrice: calculateTotal(),
                userId: decodedToken.userId
            };

            console.log('Отправляемые данные заказа:', orderData);

            const response = await axios.post(
                'http://localhost:8082/api/orders/newOrder',
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            clearCart();
            alert(`Заказ #${response.data.id} успешно оформлен!`);
        } catch (err) {
            console.error('Ошибка при оформлении заказа:', err);
            setError(
                err.response?.data?.message ||
                err.message ||
                'Произошла ошибка при оформлении заказа'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Управление количеством товара
    const handleQuantityChange = (id, change) => {
        const item = cartItems.find(i => i.id === id);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity >= 1) {
                updateQuantity(id, newQuantity);
            }
        }
    };

    return (
        <div className={styles.cartContainer}>
            <h2 className={styles.cartTitle}>Ваша корзина</h2>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                    {error.includes('авториза') && (
                        <button
                            onClick={() => navigate('/login')}
                            className={styles.loginButton}
                        >
                            Войти
                        </button>
                    )}
                </div>
            )}

            {cartItems.length === 0 ? (
                <p className={styles.emptyCart}>Корзина пуста</p>
            ) : (
                <>
                    <ul className={styles.cartList}>
                        {cartItems.map((item) => (
                            <li key={item.id} className={styles.cartItem}>
                                <div className={styles.itemDetails}>
                                    <h3 className={styles.itemName}>
                                        {item.name || `Товар ${item.id}`}
                                    </h3>
                                    <p className={styles.itemPrice}>
                                        Цена: {item.price ? `${item.price.toLocaleString()} ₽` : '0 ₽'}
                                        × {item.quantity} =
                                        {item.price ? ` ${(item.price * item.quantity).toLocaleString()} ₽` : ' 0 ₽'}
                                    </p>
                                    <div className={styles.quantityControls}>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            disabled={item.quantity <= 1}
                                            className={styles.quantityButton}
                                        >
                                            -
                                        </button>
                                        <span className={styles.quantity}>{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            className={styles.quantityButton}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className={styles.removeButton}
                                >
                                    Удалить
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.cartSummary}>
                        <h3 className={styles.total}>
                            Итого: {calculateTotal().toLocaleString()} ₽
                        </h3>
                        <button
                            className={styles.checkoutButton}
                            onClick={handleCheckout}
                            disabled={isLoading || cartItems.length === 0}
                        >
                            {isLoading ? (
                                <span className={styles.spinner}></span>
                            ) : (
                                'Оформить заказ'
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;