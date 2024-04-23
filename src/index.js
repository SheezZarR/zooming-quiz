import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './HomePage/styles-small.css';
import './HomePage/styles-medium.css';
import './HomePage/styles-big.css';
import './HomePage/styles-xl.css';
import AppWithNav from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithNav />
  </React.StrictMode>
);


