import React from "react";
import PageRouter from "./page-router";
import { ThemeProvider } from 'styled-components';
import { dark } from "../theme/dark";
import { GlobalStyles } from "../components/global-style";

export const RootComponent: React.FC = () => {
  return (
    <ThemeProvider theme={dark}>
      <>
        <GlobalStyles/>
        <PageRouter/>
      </>
    </ThemeProvider>
  );
};

