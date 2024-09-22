import React from "react";
import { SnackbarProvider } from "notistack";
import Driver from "../pages/Driver";

const IntegrationNotistack = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Driver />
    </SnackbarProvider>
  );
};
export default IntegrationNotistack;
