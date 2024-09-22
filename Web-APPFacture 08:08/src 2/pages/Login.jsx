import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import {
  Box,
  Button,
  TextField,
  Modal,
  Backdrop,
  Fade,
  Typography,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
} from "@mui/material";
import { ReactSession } from "react-client-session";
import config from "./global/config";
import ChangePassword from "./ChangePassword";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Login = ({ onLogin }) => {
  const url = config.apiUrl + "login.php";
  const urlVisibility = config.apiUrl + "selection.php";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firstLogin, setFirstLogin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const requestGetVisibility = async (id, role) => {
    if (role !== "admin") {
      try {
        const response = await axios.get(urlVisibility, {
          params: { idUser: id, visibility: "" },
        });
        console.log("Visibility Data:", response.data);
        ReactSession.set("visibility", response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (username === "" || password === "") {
        setError("Veuillez entrer un nom d'utilisateur et un mot de passe.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(url, {
        username: username,
        password: password,
        // date: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
      });

      const userData = response.data;

      if (userData.error) {
        setError("Nom d'utilisateur ou mot de passe incorrect!");
        setIsLoading(false);
        return;
      }

      const { idUser, role, active, first_login } = userData;

      if (parseInt(active, 10) === 1) {
        ReactSession.setStoreType("localStorage");
        ReactSession.set("idUser", idUser);
        ReactSession.set("username", username);
        ReactSession.set("role", role);
        ReactSession.set("date", selectedDate);

        if (rememberMe) {
          // Implement remember me functionality
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("username", username);
        }

        if (first_login == 1) {
          setFirstLogin(true);
        } else {
          await completeLogin(idUser, role);
        }
      } else {
        alert("Votre compte a été désactivé !");
      }
    } catch (error) {
      console.error("Error during login request:", error);
      if (error.response && error.response.status === 401) {
        setError("Nom d'utilisateur ou mot de passe incorrect!");
      } else {
        setError("Erreur de connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const completeLogin = async (idUser, role) => {
    await requestGetVisibility(idUser, role);
    onLogin();
    window.location.reload();
  };

  const handleCloseModal = () => {
    setFirstLogin(false);
    // Clear session data if the modal is closed without changing password
    ReactSession.remove("idUser");
    ReactSession.remove("username");
    ReactSession.remove("role");
    setError("Vous devez changer votre mot de passe pour continuer.");
  };

  const handlePasswordChanged = async () => {
    setFirstLogin(false);
    const idUser = ReactSession.get("idUser");
    const role = ReactSession.get("role");
    await completeLogin(idUser, role);
  };

  const handleRememberMe = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    console.log("Forgot password clicked");
    // You would typically redirect to a password reset page or open a modal here
  };

  return (
    <Box m="150px" display="flex" flexDirection="column" alignItems="center">
      <Header
        title="Connexion"
        subtitle="Connecter avec votre nom d'utilisateur et votre mot de passe."
      />
      <Box m="20px" flexDirection="column" textAlign="center">
        <TextField
          style={{ marginTop: "20px", marginBottom: "20px" }}
          fullWidth
          variant="filled"
          type="text"
          label="Nom d'Utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!error}
        />
        <TextField
          style={{ marginTop: "20px", marginBottom: "20px" }}
          fullWidth
          variant="filled"
          type="password"
          label="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!error}
        />
        <Box style={{ marginTop: "20px", marginBottom: "20px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={dayjs(selectedDate)}
              onChange={(newDate) => {
                const formattedDate = newDate.format("YYYY-MM-DD");
                setSelectedDate(formattedDate);
              }}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: false } }}
            />
          </LocalizationProvider>
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={handleRememberMe}
              name="rememberMe"
              color="secondary"
            />
          }
          label="Se souvenir de moi"
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            style={{
              width: "150px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
            type="Button"
            color="secondary"
            variant="contained"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Connexion"}
          </Button>
        </Box>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Link
          component="button"
          variant="body2"
          onClick={handleForgotPassword}
          color="secondary"
        >
          Mot de passe oublié?
        </Link>
      </Box>

      <Modal
        open={firstLogin}
        onClose={handleCloseModal}
        aria-labelledby="modal-change-password-title"
        aria-describedby="modal-change-password-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={firstLogin}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor:
                theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
              boxShadow: theme.shadows[5],
              padding: theme.spacing(4),
              borderRadius: theme.shape.borderRadius,
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 4",
              },
            }}
          >
            <Typography variant="h5" gutterBottom>
              Modifier le mot de passe
            </Typography>
            <ChangePassword onPasswordChanged={handlePasswordChanged} />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Login;
