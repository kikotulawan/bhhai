import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app'; 
import '../css/app.css';
import '../css/styles.css';
import '../css/scroll.css';
import NewApp from './NewApp';
import Navbar from './components/nav/Navbar';
import FooterComponent from './components/footer';
import CustomSidebar from './components/sidebar';
import Header from './components/header';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <Router>
        <App />
      </Router>
    );
  }

  const adminElement = document.getElementById('admin');
  if (adminElement) {
    ReactDOM.createRoot(adminElement).render(
      <Router>
        <NewApp />
      </Router>
    );
  }

  const navbarRoots = document.querySelectorAll('.react-navbar');
  navbarRoots.forEach(navbarRoot => {
    if (navbarRoot) {
      ReactDOM.createRoot(navbarRoot).render(
        <Router>
          <Navbar />
        </Router>
      );
    }
  });

  const footerRoot = document.getElementById('footer');
  if (footerRoot) {
    ReactDOM.createRoot(footerRoot).render(
      <Router>
        <FooterComponent />
      </Router>
    );
  }

  const sidebarRoot = document.querySelector('.sidebar');
  if (sidebarRoot) {
    ReactDOM.createRoot(sidebarRoot).render(
      <Router>
        <CustomSidebar />
      </Router>
    );
  }

  const headerRoot = document.querySelector('.header');
  if (headerRoot) {
    ReactDOM.createRoot(headerRoot).render(
      <Router>
        <Header />
      </Router>
    );
  }
});
