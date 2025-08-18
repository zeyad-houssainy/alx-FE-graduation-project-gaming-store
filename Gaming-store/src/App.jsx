import './App.css'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRouter from './AppRouter'

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-['Poppins'] relative transition-colors duration-300">
          <AppRouter />
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
