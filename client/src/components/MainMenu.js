import React from 'react';
import { Link } from 'react-router-dom';
import argLogo from '../assets/arg-logo.png';

const MainMenu = () => {
  return (
    <div className="menu-container">
      <img src={argLogo} alt="ARG Logo" className="logo" />
      <h1>ARG Work Order Management</h1>
      <nav>
        <ul>
          <li><Link to="/scanner">Scan Work Order</Link></li>
          <li><Link to="/generate-test-workorder">Generate Test Work Order</Link></li>
          <li><Link to="/workorders">View Work Orders</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default MainMenu;
