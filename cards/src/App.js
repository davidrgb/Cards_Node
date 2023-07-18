import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './pages/Layout.js';
import Login from './pages/Login.js';
import Home from './pages/Home.js';
import NoPage from './pages/NoPage.js';

import RequireAuth from './components/RequireAuth';
import Deck from './pages/Deck';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<RequireAuth target="/"><Home /></RequireAuth>} />
          <Route path="/deck/:deckId" element={<Deck />} />
          <Route path="*" element={<RequireAuth><NoPage /></RequireAuth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
