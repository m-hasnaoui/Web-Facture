import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import Header from "../components/Header";
import { tokens } from "../theme";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Button } from "reactstrap";

function Welcome() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {}, []);

  return (
    <Box m="25px" display="flex">
      <Header
        title="Bienvenue sur l'Application Web:"
        subtitle="N'hésitez pas à naviguer vers les pages auxquelles vous avez accès!"
      />
      {/* <SnackbarProvider /> */}
      {/* <Button onClick={() => enqueueSnackbar("That was easy!")}> */}
      {/* Show snackbar */}
      {/* </Button> */}
    </Box>
  );
}

export default Welcome;
