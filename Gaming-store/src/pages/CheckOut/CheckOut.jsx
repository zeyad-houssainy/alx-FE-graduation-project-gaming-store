import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../../stores';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import axios from 'axios';
