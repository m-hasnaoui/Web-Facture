// ChangePassword.js
import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import config from "./global/config";
import { ReactSession } from "react-client-session";

const ChangePassword = ({ onPasswordChanged }) => {
  const theme = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

 const url = "http://localhost/backend/changePassword.php";

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }

      const userId = ReactSession.get("idUser");
      if (!userId) {
        setError("ID utilisateur manquant. Veuillez vous reconnecter.");
        return;
      }

      const data = {
        idUser: userId,
        newPassword: newPassword,
      };

      console.log("Sending data:", data);

      const response = await axios.put(url, data);

      console.log("Response:", response);

      if (response.data && response.data.success) {
        // Call onPasswordChanged to complete the login process
        onPasswordChanged();
      } else {
        setError(
          response.data.error || "Erreur lors du changement de mot de passe."
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      console.error("Error response:", error.response);
      setError(
        "Erreur lors du changement de mot de passe. Détails: " +
          (error.response?.data?.error || error.message)
      );
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleChangePassword();
    }
  };

  return (
    <Box sx={{ p: 3, width: 400, maxWidth: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Changer le Mot de Passe
      </Typography>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="newPassword"
          label="Nouveau Mot de Passe"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
          onKeyPress={handleKeyPress}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmer le Mot de Passe"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
          onKeyPress={handleKeyPress}
        />
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleChangePassword}
          sx={{
            mt: 2,
            py: 2,
            bgcolor: theme.palette.success.main,
            "&:hover": { bgcolor: theme.palette.success.dark },
          }}
        >
          Sauvegarder le Mot de Passe
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
