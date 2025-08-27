import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../stores';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

export default function CheckOut() {
  const navigate = useNavigate();
  const { items, clearCart, getCartTotal } = useCartStore();
  const { addOrder, isLoggedIn, user } = useAuth();
