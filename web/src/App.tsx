import React, { useState, useEffect } from 'react';
import { Routes } from './Routes';
import { setAccessToken } from './lib/accessToken';
import './styles/App.css'

interface Props { }
const URL_BASE = process.env.NODE_ENV === 'production' ? 'https://eat--it.herokuapp.com' : 'http://localhost:4000'

export const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${URL_BASE}/refresh_token`, {
      method: 'POST',
      credentials: 'include'
    }).then(async x => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return <Routes />;
};
