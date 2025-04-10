import React from 'react';
import { Link } from 'react-router-dom';
import argLogo from '../assets/arg-logo.png';

const MainMenu = () => {
  return (
    <div style={styles.container}>
      <img src={argLogo} alt="ARG Logo" style={styles.logo} />
      <h1 style={styles.header}>ARG Work Order Management</h1>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/scanner" style={styles.navLink}>Scan Work Order</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/generate-test-workorder" style={styles.navLink}>Generate Test Work Order</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/workorders" style={styles.navLink}>View Work Orders</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "10px",
    border: "2px solid #cc3333", // Reddish border to match the screenshot
    borderRadius: "5px",
    backgroundColor: "#fff", // White background as per the screenshot
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    textAlign: "center",
  },
  logo: {
    maxWidth: "150px",
    marginBottom: "10px",
  },
  header: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "#ff3333", // Red header matches the screenshot
  },
  navList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  navItem: {
    margin: "5px 0",
  },
  navLink: {
    display: "block",
    padding: "5px 15px",
    backgroundColor: "#666", // Gray background matches the screenshot
    color: "#fff",
    textDecoration: "none",
    border: "1px solid #000", // Black border instead of red
    fontSize: "14px",
  },
};

export default MainMenu;