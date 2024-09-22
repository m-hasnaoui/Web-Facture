import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const AddCompteur = ({
  theme,
  colors,
  handleChange,
  selectedAcodnum,
  setSelectedAcodnum,
}) => {
  const originalCompList = {
    POSCTE: "Constante",
    POSCTE1: "Année",
    POSCTE2: "Mois",
    POSCTE3: "Jour",
    POSCTE4: "Société",
    POSCTE5: "Séquence",
  };

  const [compList, setCompList] = useState({ ...originalCompList });
  const [selectedComp, setSelectedComp] = useState("");
  const [compLength, setCompLength] = useState("");
  const [compFormula, setCompFormula] = useState("");
  const [tableData, setTableData] = useState([]);

  const handleSelectChange = (e) => {
    setSelectedComp(e.target.value);
  };

  const handleLengthChange = (e) => {
    setCompLength(e.target.value);
  };

  const handleFormulaChange = (e) => {
    setCompFormula(e.target.value);
  };

  const handleAddComponent = () => {
    if (selectedComp) {
      let updatedAcodnum = { ...selectedAcodnum };
      const nextPOSCTE = `POSCTE${
        tableData.length > 0 ? tableData.length : ""
      }`;

      updatedAcodnum[nextPOSCTE] = selectedComp;

      if (selectedComp === "Année") {
        updatedAcodnum.POSTYP1 = compLength;
      } else if (selectedComp === "Mois") {
        updatedAcodnum.POSTYP2 = compLength;
      } else if (selectedComp === "Jour") {
        updatedAcodnum.POSTYP3 = compLength;
      } else if (selectedComp === "Société") {
        updatedAcodnum.POSTYP4 = compLength;
      } else if (selectedComp === "Séquence") {
        updatedAcodnum.POSTYP5 = compLength;
      } else if (selectedComp === "Constante") {
        updatedAcodnum.Formule = compFormula;
      }

      setSelectedAcodnum(updatedAcodnum);

      const newRow = {
        type: selectedComp,
        length: compLength,
        formula: compFormula,
      };
      setTableData([...tableData, newRow]);

      setCompList((prevList) => {
        const updatedList = { ...prevList };
        const keyToRemove = Object.keys(updatedList).find(
          (key) => updatedList[key] === selectedComp
        );
        if (keyToRemove) {
          delete updatedList[keyToRemove];
        }
        return updatedList;
      });

      setSelectedComp("");
      setCompLength("");
      setCompFormula("");
    }
  };

  const handleDeleteComponent = (index) => {
    const updatedTableData = [...tableData];
    const deletedComponent = updatedTableData[index];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);

    setCompList((prevList) => {
      const originalKey = Object.keys(originalCompList).find(
        (key) => originalCompList[key] === deletedComponent.type
      );
      if (originalKey) {
        return {
          ...prevList,
          [originalKey]: deletedComponent.type,
        };
      }
      return prevList;
    });

    let updatedAcodnum = { ...selectedAcodnum };
    const poscteToRemove = `POSCTE${index > 0 ? index : ""}`;
    updatedAcodnum[poscteToRemove] = "";

    if (deletedComponent.type === "Année") {
      updatedAcodnum.POSTYP1 = "";
    } else if (deletedComponent.type === "Mois") {
      updatedAcodnum.POSTYP2 = "";
    } else if (deletedComponent.type === "Jour") {
      updatedAcodnum.POSTYP3 = "";
    } else if (deletedComponent.type === "Société") {
      updatedAcodnum.POSTYP4 = "";
    } else if (deletedComponent.type === "Séquence") {
      updatedAcodnum.POSTYP5 = "";
    } else if (deletedComponent.type === "Constante") {
      updatedAcodnum.Formule = "";
    }

    // Shift remaining components
    for (let i = index; i < tableData.length - 1; i++) {
      const currentPOSCTE = `POSCTE${i > 0 ? i : ""}`;
      const nextPOSCTE = `POSCTE${i + 1}`;
      updatedAcodnum[currentPOSCTE] = updatedAcodnum[nextPOSCTE];
    }

    // Clear the last POSCTE
    const lastPOSCTE = `POSCTE${tableData.length - 1}`;
    updatedAcodnum[lastPOSCTE] = "";

    setSelectedAcodnum(updatedAcodnum);
  };

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
        padding: "20px",
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="Compteur"
          name="CODNUM"
          color="success"
          value={selectedAcodnum.CODNUM}
          onChange={handleChange}
          sx={{ mr: 2 }}
        />
        <TextField
          fullWidth
          color="success"
          variant="outlined"
          label="Intitulé"
          name="DES"
          value={selectedAcodnum.DES}
          onChange={handleChange}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box component="section" display="flex" sx={{ p: 2 }}>
          <FormControl component="fieldset" color="success">
            <FormLabel component="legend" color="success">
              Niveau définition
            </FormLabel>
            <RadioGroup
              row
              name="NIVDEF"
              value={selectedAcodnum.NIVDEF}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Dossier"
                control={<Radio color="success" />}
                label="Dossier"
              />
              <FormControlLabel
                value="Société"
                control={<Radio color="success" />}
                label="Société"
              />
              <FormControlLabel
                value="Site"
                control={<Radio color="success" />}
                label="Site"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box component="section" display="flex" sx={{ p: 2 }}>
          <FormControl component="fieldset" color="warning">
            <FormLabel component="legend" color="warning">
              Niveau RAZ
            </FormLabel>
            <RadioGroup
              row
              name="NIVRAZ"
              value={selectedAcodnum.NIVRAZ}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Pas de RAZ"
                control={<Radio color="success" />}
                label="Pas de RAZ"
              />
              <FormControlLabel
                value="Mensuel"
                control={<Radio color="success" />}
                label="Mensuel"
              />
              <FormControlLabel
                value="Annuel"
                control={<Radio color="success" />}
                label="Annuel"
              />
              <FormControlLabel
                value="Exercice"
                control={<Radio color="success" />}
                label="Exercice"
              />
              <FormControlLabel
                value="Période"
                control={<Radio color="success" />}
                label="Période"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box component="section" display="flex" sx={{ p: 2 }}>
          <FormControl component="fieldset" color="info">
            <FormLabel component="legend" color="info">
              Type
            </FormLabel>
            <RadioGroup
              row
              name="TYP"
              value={selectedAcodnum.TYP}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Alphanumerique"
                control={<Radio color="success" />}
                label="Alphanumérique"
              />
              <FormControlLabel
                value="Numérique"
                control={<Radio color="success" />}
                label="Numérique"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          fullWidth
          color="secondary"
          variant="outlined"
          label="Valeur initiale (VAL)"
          name="VAL"
          type="number"
          value={selectedAcodnum.VAL}
          onChange={handleChange}
          sx={{ mr: 2 }}
        />
      </Box>

      <Typography variant="h6" mb={2}>
        Composants
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Select
            color="secondary"
            fullWidth
            label="Composant"
            value={selectedComp}
            onChange={handleSelectChange}
          >
            {Object.entries(compList).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
          {selectedComp === "Constante" ? (
            <TextField
              fullWidth
              type="text"
              color="secondary"
              label="Formule"
              value={compFormula}
              onChange={handleFormulaChange}
            />
          ) : (
            <TextField
              fullWidth
              color="secondary"
              type="number"
              label="Longueur"
              value={compLength}
              onChange={handleLengthChange}
            />
          )}
        </Box>
        <Button
          variant="contained"
          onClick={handleAddComponent}
          color="success"
        >
          Ajouter le composant
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type composante</TableCell>
              <TableCell>Longueur</TableCell>
              <TableCell>Formule</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.length}</TableCell>
                <TableCell>{row.formula || "-"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteComponent(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3}>
        <FormControl component="fieldset">
          <FormLabel component="legend" color="secondary">
            Type de séquence
          </FormLabel>
          <RadioGroup
            row
            name="SEQ"
            value={selectedAcodnum.SEQ}
            onChange={handleChange}
          >
            <FormControlLabel
              value="Normal"
              control={<Radio color="success" />}
              label="Normal"
            />
            <FormControlLabel
              value="Séquence BDD"
              control={<Radio color="success" />}
              label="Séquence BDD"
            />
            <FormControlLabel
              value="Groupé"
              control={<Radio color="success" />}
              label="Groupé"
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export default AddCompteur;
