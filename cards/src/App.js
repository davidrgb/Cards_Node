import React from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './components/Login.js';

function App() {
  const [data, setData] = React.useState(null);

  return (
    Login()
  );
}

export default App;
