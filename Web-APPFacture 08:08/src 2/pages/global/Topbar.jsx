import {
  Box,
  IconButton,
  useTheme,
  Drawer,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useState, useContext, useEffect, useCallback } from "react";
import { ColorModeContext } from "../../theme";
import { tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { ExitToApp } from "@mui/icons-material";
import { ReactSession } from "react-client-session";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "./config";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inactivityTimeout, setInactivityTimeout] = useState(30 * 60 * 1000);
  const [tempTimeout, setTempTimeout] = useState(30);
  const [isUpdating, setIsUpdating] = useState(false);
  // const url = config.apiUrl + "avalnum.php";

  const handleLogout = useCallback(() => {
    ReactSession.set("username", "");
    ReactSession.set("role", "");
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Back online");
    };

    const handleOffline = () => {
      console.log("Gone offline");
      handleLogout();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!navigator.onLine) {
      handleLogout();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleLogout]);

  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleLogout, inactivityTimeout);
    };

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      clearTimeout(inactivityTimer);
    };
  }, [handleLogout, inactivityTimeout]);

  useEffect(() => {
    const fetchTimeout = async () => {
      try {
        const response = await axios.get("/api/get-timeout");
        const timeoutMinutes = response.data.timeout;
        setInactivityTimeout(timeoutMinutes * 60 * 1000);
        setTempTimeout(timeoutMinutes);
      } catch (error) {
        console.error("Failed to fetch timeout:", error);
      }
    };
    fetchTimeout();
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleTimeoutChange = async () => {
    setIsUpdating(true);
    try {
      await axios.post("/api/update-timeout", { timeout: tempTimeout });
      setInactivityTimeout(tempTimeout * 60 * 1000);
      // You might want to show a success message here
    } catch (error) {
      console.error("Failed to update timeout:", error);
      // You might want to show an error message here
    } finally {
      setIsUpdating(false);
    }
  };

  const drawerContent = (
    <Box
      role="presentation"
      p={2}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={toggleDrawer(false)}
      width={300}
      sx={{
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
        height: "100%",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Settings
      </Typography>
      <Divider sx={{ borderColor: colors.grey[300], my: 2 }} />
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Mode
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant={theme.palette.mode === "light" ? "contained" : "outlined"}
          startIcon={<LightModeOutlinedIcon />}
          onClick={() => {
            if (theme.palette.mode !== "light") {
              colorMode.toggleColorMode();
            }
          }}
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? colors.blueAccent[700]
                : "transparent",
            color: colors.grey[100],
            borderColor: colors.grey[100],
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? colors.blueAccent[800]
                  : colors.primary[300],
            },
          }}
        >
          Light
        </Button>
        <Button
          variant={theme.palette.mode === "dark" ? "contained" : "outlined"}
          startIcon={<DarkModeOutlinedIcon />}
          onClick={() => {
            if (theme.palette.mode !== "dark") {
              colorMode.toggleColorMode();
            }
          }}
          sx={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? colors.blueAccent[700]
                : "transparent",
            color: colors.grey[100],
            borderColor: colors.grey[100],
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? colors.blueAccent[800]
                  : colors.primary[300],
            },
          }}
        >
          Dark
        </Button>
      </Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Inactivity Timeout (minutes)
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <input
          type="number"
          value={tempTimeout}
          onChange={(e) => setTempTimeout(Number(e.target.value))}
          style={{
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            border: `1px solid ${colors.grey[100]}`,
            borderRadius: "4px",
            padding: "8px",
            width: "100px",
          }}
        />
        <Button
          variant="contained"
          onClick={handleTimeoutChange}
          disabled={isUpdating}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.blueAccent[800],
            },
          }}
        >
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </Box>
      <Typography variant="body2">
        Current timeout: {inactivityTimeout / 60000} minutes
      </Typography>
      <Divider sx={{ borderColor: colors.grey[300], my: 2 }} />
      <Typography variant="h5" fontWeight="bold" mb={1}>
        items
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.blueAccent[800],
            },
          }}
        >
          -
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: colors.grey[100],
            borderColor: colors.grey[100],
            "&:hover": {
              borderColor: colors.grey[400],
            },
          }}
        >
          -
        </Button>
      </Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        itemss
      </Typography>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.blueAccent[800],
          },
        }}
      >
        d
      </Button>
    </Box>
  );

  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      <IconButton onClick={toggleDrawer(true)}>
        <SettingsOutlinedIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <IconButton>
        <PersonOutlinedIcon />
      </IconButton>
      <IconButton onClick={handleLogout}>
        <ExitToApp />
      </IconButton>
    </Box>
  );
};

export default Topbar;
