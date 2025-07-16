import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "@mui/material";
import { useLocation } from 'react-router-dom';
import BreadcrumbHeader from "./BreadcrumbHeader"; // Adjust path as needed

const Layout = ({ children, isHomePage = false }) => {
  // Method 1: Use prop-based detection (recommended)
  // const isHomeComponent = isHomePage;
  
  // Method 2: Component name detection (fallback)
  // const isHomeComponent = React.Children.toArray(children).some(child => 
  //   child && child.type && (
  //     child.type.name === 'Home' || 
  //     child.type.displayName === 'Home' ||
  //     child.key === 'home'
  //   )
  // );

  // Method 3: Route-based detection (if using React Router)
  const location = useLocation();
  const isHomeComponent = location.pathname === '/';

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container 
        className={!isHomeComponent ? "frosted-glass" : ""} 
        sx={{ 
          mt: isHomeComponent ? 0 : 4, 
          mb: isHomeComponent ? 0 : 4, 
          flexWrap: "true",
          // Remove Container constraints for Home component
          ...(isHomeComponent && {
            maxWidth: "none !important",
            padding: "0 !important",
            margin: "0 !important",
          })
        }}
      >
      {!isHomeComponent && <BreadcrumbHeader />}
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;