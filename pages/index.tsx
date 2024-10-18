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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', '@PuntaCana_bot'); // Replace with your bot's name
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    document.body.appendChild(script);

    window.TelegramLoginWidget = {
      dataOnauth: (user) => onTelegramAuth(user)
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onTelegramAuth = async (user: any) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      alert('Authentication failed. You are not authorized to use this app.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Login with Telegram</h1>
          <div id="telegram-login-widget"></div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Home;