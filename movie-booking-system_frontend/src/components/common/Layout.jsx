import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <>
      <Header/>
      <Container className="frosted-glass"  sx={{ mt: 4, mb: 4, flexWrap:"true" }}>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
