import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  Box,
  useTheme,
  TextField,
  IconButton,
  Grid,
  MenuItem,
} from "@mui/material";
import Header from "../components/Header";
import { tokens } from "../theme";
import { ReactSession } from "react-client-session";
import { AddCircle, Delete } from "@mui/icons-material";
import config from "./global/config";

const tableDescriptions = {
  ABCCLS: "Catégorie ABC",
  BPSTYP: "Type fournisseur",
  // BPTNUM: "Transporteur",
  // BSGCOD: "Catégorie",
  PTE: "Condition paiement",
  CHGTYP: "Type cours",
  CUR: "Devise",
  OSTCTL: "Contrôle encours",
  PAYLOKFLG: "Blocage paiement",
  TSSCOD1: "Famille statistique",
  TSSCOD2: "Famille statistique",
  TSSCOD3: "Famille statistique",
  VACBPR: "Régime taxe",
};

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const url = "http://localhost/backend/basic_data.php/";


  const tables = [
    "ABCCLS",
    "BPSTYP",
    "PTE",
    "CHGTYP",
    "CUR",
    "OSTCTL",
    "PAYLOKFLG",
    "TSSCOD1",
    "TSSCOD2",
    "TSSCOD3",
    "VACBPR",
  ];

  const [data, setData] = useState(
    Object.fromEntries(tables.map((table) => [table, []]))
  );

  const [textValues, setTextValues] = useState(
    Object.fromEntries(tables.map((table) => [table, ""]))
  );

  const [selected, setSelected] = useState(
    Object.fromEntries(tables.map((table) => [table, ""]))
  );

  const handleChange = (e, table) => {
    const { value } = e.target;
    setSelected((prev) => ({ ...prev, [table]: value }));
  };

  const handleTextChange = (e, table) => {
    const { value } = e.target;
    setTextValues((prev) => ({ ...prev, [table]: value }));
  };

  const requestGet = async (table) => {
    try {
      const response = await axios.get(url, {
        params: { [table.toLowerCase()]: "" },
      });
      setData((prev) => ({ ...prev, [table]: response.data }));
    } catch (error) {
      console.log(error);
    }
  };

  const requestPost = async (table, description) => {
    var f = new FormData();
    f.append("description", description);
    f.append("user_cre", ReactSession.get("username"));
    f.append("METHOD", "POST");
    try {
      await axios.post(url, f, {
        params: { [table.toLowerCase()]: "" },
      });
      requestGet(table);
    } catch (error) {
      console.error(error);
    }
  };
  const requestDelete = async (table, code) => {
    var f = new FormData();
    f.append("user_del", ReactSession.get("username"));
    f.append("METHOD", "DELETE");
    try {
      await axios.post(url, f, {
        params: {
          [table.toLowerCase()]: "",
          Code: code,
          user_del: ReactSession.get("username"),
        },
      });
      // Update the state immediately
      setData((prevData) => ({
        ...prevData,
        [table]: prevData[table].filter((item) => item.Code !== code),
      }));
      setSelected((prevSelected) => ({ ...prevSelected, [table]: "" }));
      // Then refresh data from the server
      requestGet(table);
    } catch (error) {
      console.error(
        "Delete error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  useEffect(() => {
    tables.forEach((table) => requestGet(table));
    console.log(ReactSession.get("date"));
  }, []);

  const renderTableSection = (table) => (
    <Grid item xs={3} key={table}>
      <Box
        p="10px 0px 10px 0px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label={tableDescriptions[table]}
          value={textValues[table]}
          onChange={(e) => handleTextChange(e, table)}
          sx={{ gridColumn: "span 8" }}
        />
        <IconButton
          color="secondary"
          size="large"
          onClick={() => {
            if (textValues[table]) {
              requestPost(table, textValues[table]);
              setTextValues((prev) => ({ ...prev, [table]: "" }));
            }
          }}
        >
          <AddCircle fontSize="inherit" />
        </IconButton>
      </Box>
      <Box
        p="10px 0px 10px 0px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          fullWidth
          variant="filled"
          select
          label={
            tableDescriptions[table] ? `  ${tableDescriptions[table]}` : ""
          }
          value={selected[table]}
          onChange={(e) => handleChange(e, table)}
          sx={{ gridColumn: "span 4" }}
        >
          {data[table].map((item) => (
            <MenuItem value={item.Code} key={item.Code}>
              {item.description}
            </MenuItem>
          ))}
        </TextField>
        <IconButton
          color="secondary"
          size="large"
          onClick={() => {
            if (selected[table]) {
              requestDelete(table, selected[table]);
            }
          }}
        >
          <Delete fontSize="inherit" />
        </IconButton>
      </Box>
    </Grid>
  );

  return (
    <Box m="25px">
      <Header
        title="Dashboard"
        subtitle="Configure all possible options for the application."
      />
      <Box m="40px 0 0 0" height="75vh" sx={{ overflowY: "auto" }}>
        <Grid container spacing={2}>
          {tables.map(renderTableSection)}
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
