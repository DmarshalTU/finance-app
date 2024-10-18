import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: any) => void;
    };
  }
}

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Initializing...');
  const NEXT_PUBLIC_TELEGRAM_BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME

  useEffect(() => {
    setDebugInfo('Loading Telegram script...');
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', NEXT_PUBLIC_TELEGRAM_BOT_NAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    document.body.appendChild(script);

    script.onload = () => {
      setDebugInfo('Telegram script loaded.');
    };

    script.onerror = () => {
      setDebugInfo('Error loading Telegram script.');
    };

    window.TelegramLoginWidget = {
      dataOnauth: (user) => {
        setDebugInfo('Received auth data from Telegram. Validating...');
        onTelegramAuth(user);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onTelegramAuth = async (user: any) => {
    setDebugInfo('Sending auth data to server...');
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setDebugInfo('Authentication successful.');
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        setDebugInfo(`Authentication failed: ${errorData.error}`);
      }
    } catch (error) {
      setDebugInfo(`Error during authentication: ${error}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Login with Telegram</h1>
          <div id="telegram-login-widget"></div>
          <p className="mt-4 text-white">{debugInfo}</p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Home;