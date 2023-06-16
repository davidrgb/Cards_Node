import React from 'react';
import './App.css';

import Login from './pages/Login.js';

function App() {
  const [data, setData] = React.useState(null);

  return (
    Login()
  );
}

export default App;
