import { useEffect } from 'react';
import { useThemeStore } from './stores';
import AppRouter from './AppRouter';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { initTheme } = useThemeStore();

  // Initialize theme on app mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans relative transition-colors duration-300">
      <AppRouter />
    </div>
  );
}

export default App;
