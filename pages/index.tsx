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

  useEffect(() => {
    setDebugInfo('Loading Telegram script...');
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
    if (!botName) {
      setDebugInfo('Error: Telegram bot name not set in environment variables.');
      return;
    }
    
    setDebugInfo(`Setting up Telegram widget for bot: ${botName}`);
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    document.body.appendChild(script);

    script.onload = () => {
      setDebugInfo('Telegram script loaded. Waiting for user interaction...');
    };

    script.onerror = (error) => {
      setDebugInfo(`Error loading Telegram script: ${error}`);
    };

    window.TelegramLoginWidget = {
      dataOnauth: (user) => {
        setDebugInfo(`Received auth data from Telegram: ${JSON.stringify(user)}`);
        onTelegramAuth(user);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onTelegramAuth = async (user: any) => {
    setDebugInfo(`Sending auth data to server: ${JSON.stringify(user)}`);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const responseData = await response.json();
      setDebugInfo(`Server response: ${JSON.stringify(responseData)}`);

      if (response.ok) {
        setDebugInfo('Authentication successful.');
        setIsAuthenticated(true);
      } else {
        setDebugInfo(`Authentication failed: ${responseData.error}`);
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