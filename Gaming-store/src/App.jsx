import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRouter from './AppRouter'

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans relative transition-colors duration-300">
          <AppRouter />
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
