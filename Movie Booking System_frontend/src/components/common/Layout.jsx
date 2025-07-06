import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header/>
      <Container className="frosted-glass"  sx={{ mt: 4, mb: 4, flexWrap:"true" }}>{children}</Container>
      <Footer />
    </div>
  );
};

export default Layout;
