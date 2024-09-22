import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  useMediaQuery,
  FormLabel,
  FormControl,
  Alert,
  Stack,
  Typography,
  IconButton,
  Checkbox,
  Tooltip,
} from "@mui/material";
import Header from "../components/Header";
import { tokens } from "../theme";
import {
  DataGrid,
  GridActionsCellItem,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Tab from "@mui/material/Tab";

const Societe = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "societe.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";
  const [selectedTab, setSelectedTab] = useState("1");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const [dataProfile, setDataProfile] = useState([]);
  const [data, setData] = useState([]);
  const [dataSold, setDataSold] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [DateStart, setDateStart] = useState(dayjs().add(-7, "day"));
  const [DateEnd, setDateEnd] = useState(dayjs());
  const [DataSUM, setDataSUM] = useState({ total_sum: 0 });
  const [showTotal, setShowTotal] = useState(false);

  const [selectedSociete, setSelectedSociete] = useState({
    code_sc: "",
    raison_sociale: "",
    financie: false,
    active: false,
    site_destockage: false,
    address: "",
    user_cre: "",
    gestion_depot: false,
    telephone: "",
    responsable: "",
    user_del: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedSociete((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearSelected = () => {
    setSelectedSociete({
      code_sc: "",
      raison_sociale: "",
      financie: false,
      active: false,
      site_destockage: false,
      address: "",
      user_cre: "",
      gestion_depot: false,
      telephone: "",
      responsable: "",
      user_del: "",
    });
  };
  const toggleShowTotal = () => {
    setShowTotal((prevShowTotal) => !prevShowTotal);
  };

  const openCloseModalInsert = () => {
    clearSelected();
    setModalAdd(!modalAdd);
    setError(false);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const requestGetProfile = async (id, page) => {
    try {
      const response = await axios.get(urlProfile, {
        params: { idUser: id, page: page },
      });
      setDataProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const requestGet = async () => {
    await axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async () => {
    if (
      !selectedSociete.raison_sociale ||
      !selectedSociete.address ||
      !selectedSociete.responsable ||
      !selectedSociete.telephone
    ) {
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append("raison_sociale", selectedSociete.raison_sociale);
    formData.append("responsable", selectedSociete.responsable);
    formData.append("telephone", selectedSociete.telephone);
    formData.append("financie", selectedSociete.financie ? "1" : "0");
    formData.append("active", selectedSociete.active ? "1" : "0");
    formData.append(
      "site_destockage",
      selectedSociete.site_destockage ? "1" : "0"
    );
    formData.append("address", selectedSociete.address);
    formData.append("gestion_depot", selectedSociete.gestion_depot ? "1" : "0");
    formData.append("user_cre", ReactSession.get("username"));
    formData.append("METHOD", "POST");

    try {
      const response = await axios.post(url, formData);
      //   setData([...data, response.data]);
      setData(data.concat(response.data));

      clearSelected();
      requestGet();
      openCloseModalInsert();
    } catch (error) {
      console.error(error);
    }
  };
  const requestPut = async () => {
    const formData = new FormData();
    formData.append("raison_sociale", selectedSociete.raison_sociale);
    // const Checkfinancie =
    //   selectedSociete.financie === "Oui"
    //     ? "1"
    //     : selectedSociete.financie === "Non"
    //     ? "0"
    //     : selectedSociete.financie;
    // formData.append("financie", Checkfinancie);

    formData.append("financie", selectedSociete.financie ? "1" : "0");
    formData.append("active", selectedSociete.active ? "1" : "0");
    // const Checkactive =
    //   selectedSociete.active === "Oui"
    //     ? "1"
    //     : selectedSociete.active === "Non"
    //     ? "0"
    //     : selectedSociete.active;
    // formData.append("active", Checkactive);

    formData.append(
      "site_destockage",
      selectedSociete.site_destockage ? "1" : "0"
    );
    // const Checksite_destockage =
    //   selectedSociete.site_destockage === "Oui"
    //     ? "1"
    //     : selectedSociete.site_destockage === "Non"
    //     ? "0"
    //     : selectedSociete.site_destockage;
    // formData.append("site_destockage", Checksite_destockage);

    formData.append("address", selectedSociete.address);
    formData.append("gestion_depot", selectedSociete.gestion_depot ? "1" : "0");
    // const Checkgestion_depot =
    //   selectedSociete.gestion_depot === "Oui"
    //     ? "1"
    //     : selectedSociete.gestion_depot === "Non"
    //     ? "0"
    //     : selectedSociete.gestion_depot;
    // formData.append("gestion_depot", Checkgestion_depot);
    formData.append("responsable", selectedSociete.responsable);
    formData.append("telephone", selectedSociete.telephone);
    formData.append("user_upd", ReactSession.get("username"));

    formData.append("METHOD", "PUT");

    try {
      await axios.post(url, formData, {
        params: { code_sc: selectedSociete.code_sc },
      });

      setData((prevData) => {
        return prevData.map((Societe) =>
          Societe.code_sc === selectedSociete.code_sc
            ? { ...Societe, ...selectedSociete }
            : Societe
        );
      });

      requestGet();
      openCloseModalEdit();
      clearSelected();
    } catch (error) {
      console.error(error);
    }
  };

  const requestDelete = async () => {
    try {
      var f = new FormData();
      f.append("METHOD", "DELETE");
      // Add additional parameters to the FormData object
      f.append("user_del", ReactSession.get("username"));

      await axios.post(url, f, {
        params: {
          code_sc: selectedSociete.code_sc,
          user_del: ReactSession.get("username"),
        },
      });
      setData(
        data.filter((Societe) => Societe.code_sc !== selectedSociete.code_sc)
      );
      openCloseModalDelete();
    } catch (error) {
      console.error(error);
    }
  };

  const selectSociete = (Societe, action) => {
    setSelectedSociete(Societe);
    action === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const columns = [
    { field: "code_sc", headerName: "ID", flex: 0.5 },
    {
      field: "raison_sociale",
      headerName: "Raison Sociale",
      flex: 1,
    },
    {
      field: "financie",
      headerName: "Financie",
      flex: 1,
      renderCell: (params) => {
        return params.value === 1 ? "Oui" : "Non";
      },
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      renderCell: (params) => {
        return params.value === 1 ? "Oui" : "Non";
      },
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "site_destockage",
      headerName: "Site Destockage",
      flex: 1,
      renderCell: (params) => {
        return params.value === 1 ? "Oui" : "Non";
      },
    },
    {
      field: "gestion_depot",
      headerName: "Gestion Depot",
      flex: 1,
      renderCell: (params) => {
        return params.value === 1 ? "Oui" : "Non";
      },
    },
    { field: "responsable", headerName: "Responsable", flex: 1 },
    { field: "telephone", headerName: "Telephone", flex: 1 },

    ...(ReactSession.get("role") === "admin"
      ? [
          {
            field: "user_cre",
            headerName: "Nom d'utilisateur",
            width: 100,
            cellClassName: "name-column--cell2",
          },
        ]
      : []),
    // ...(ReactSession.get("role") === "admin"
    //   ? [
    //       {
    //         field: "gestion_depot",
    //         headerName: "utilisateur-mise à jour",
    //         flex: 0.5,
    //         // width: 150,
    //         cellClassName: "name-column--cell2",
    //         renderCell: (params) => {
    //           return params.value === null ? "_" : selectPointing.gestion_depot;
    //         },
    //       },
    //     ]
    //   : []),
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      renderCell: (params) => {
        return [
          (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          ReactSession.get("role") == "admin" ? (
            <Tooltip title="Edit this item" arrow>
              <GridActionsCellItem
                key={`edit-${params.row.code_sc}`}
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={() => selectSociete(params.row, "Edit")}
                color="inherit"
                //   disabled={true}
              />
            </Tooltip>
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <Tooltip title="Delete this item" arrow>
              <GridActionsCellItem
                key={`delete-${params.row.code_sc}`}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => selectSociete(params.row, "Delete")}
                color="inherit"
              />
            </Tooltip>
          ) : null,
        ];
      },
    },
  ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await requestGetProfile(ReactSession.get("idUser"), "Societe");
  //       await requestGet();
  //       // await console.log(
  //       //   ReactSession.get("visibility").filter((item) => item.page)
  //       // );

  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await requestGetProfile(ReactSession.get("idUser"), "Societe");
        await requestGet();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <>
          <Header title="Societes" subtitle="List des Societe" />
          {(dataProfile.some((profile) => profile.op_add === 1) ||
            ReactSession.get("role") === "admin") && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="end"
              mt="20px"
            >
              <Box
                mt="30px"
                display="flex"
                justifyContent="end"
                alignItems="center"
              >
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={() => openCloseModalInsert()}
                >
                  Nouvelle societe
                </Button>
              </Box>
            </Box>
          )}

          <Modal isOpen={modalAdd}>
            <ModalHeader
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              Ajouter Societe
            </ModalHeader>
            <ModalBody
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              <TabContext value={selectedTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleTabChange} aria-label="societe tabs">
                    <Tab label="General" value="1" />
                    <Tab label="Details" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(8, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Raison Sociale"
                      onChange={handleChange}
                      name="raison_sociale"
                      sx={{ gridColumn: "span 8" }}
                    />
                    <FormControl
                      component="fieldset"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={selectedSociete.financie}
                            onChange={handleChange}
                            name="financie"
                          />
                        }
                        label="Financie"
                      />
                    </FormControl>
                    <FormControl
                      component="fieldset"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={selectedSociete.active}
                            onChange={handleChange}
                            name="active"
                          />
                        }
                        label="Active"
                      />
                    </FormControl>
                    <FormControl
                      component="fieldset"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={selectedSociete.site_destockage}
                            onChange={handleChange}
                            name="site_destockage"
                          />
                        }
                        label="Site Destockage"
                      />
                    </FormControl>
                    <FormControl
                      component="fieldset"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={selectedSociete.gestion_depot}
                            onChange={handleChange}
                            name="gestion_depot"
                          />
                        }
                        label="Gestion Depot"
                      />
                    </FormControl>
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(8, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Address"
                      onChange={handleChange}
                      name="address"
                      sx={{ gridColumn: "span 8" }}
                    />
                    <TextField
                      color="secondary"
                      fullWidth
                      variant="filled"
                      label="Telephone"
                      onChange={handleChange}
                      name="telephone"
                      sx={{ gridColumn: "span 8" }}
                    />
                    <TextField
                      color="secondary"
                      fullWidth
                      variant="filled"
                      label="Responsable"
                      onChange={handleChange}
                      name="responsable"
                      sx={{ gridColumn: "span 8" }}
                    />
                  </Box>
                </TabPanel>
              </TabContext>
            </ModalBody>
            <ModalFooter
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              {error && <Alert severity="error">Missing required fields</Alert>}
              <Button
                variant="contained"
                color="primary"
                onClick={() => requestPost()}
              >
                Ajouter
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => openCloseModalInsert()}
              >
                Fermer
              </Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={modalEdit}>
            <ModalHeader
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              Modifier Société
            </ModalHeader>
            <ModalBody
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              <TabContext value={selectedTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleTabChange} aria-label="societe tabs">
                    <Tab label="General" value="1" />
                    <Tab label="Details" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(8, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Raison Sociale"
                      name="raison_sociale"
                      value={selectedSociete.raison_sociale}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 8" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSociete.financie}
                          onChange={handleChange}
                          name="financie"
                          color="secondary"
                        />
                      }
                      label="Financie"
                      sx={{ gridColumn: "span 2" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSociete.active}
                          onChange={handleChange}
                          name="active"
                          color="secondary"
                        />
                      }
                      label="Active"
                      sx={{ gridColumn: "span 2" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSociete.site_destockage}
                          onChange={handleChange}
                          name="site_destockage"
                          color="secondary"
                        />
                      }
                      label="Site de Stockage"
                      sx={{ gridColumn: "span 2" }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSociete.gestion_depot}
                          onChange={handleChange}
                          name="gestion_depot"
                          color="secondary"
                        />
                      }
                      label="Gestion Dépôt"
                      sx={{ gridColumn: "span 2" }}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(8, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    {/* Add additional fields as needed for Details tab */}
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Responsable"
                      name="responsable"
                      value={selectedSociete.responsable}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 8" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Téléphone"
                      name="telephone"
                      value={selectedSociete.telephone}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 8" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Adresse"
                      name="address"
                      value={selectedSociete.address}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 8" }}
                    />
                  </Box>
                </TabPanel>
              </TabContext>
            </ModalBody>
            <ModalFooter
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              {error && (
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="error">Des champs sont manquants</Alert>
                </Stack>
              )}
              <Button variant="contained" color="primary" onClick={requestPut}>
                Enregistrer
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={openCloseModalEdit}
              >
                Fermer
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={modalDelete}
            style={
              theme.palette.mode === "dark"
                ? { backgroundColor: colors.primary[500] }
                : { backgroundColor: "#fcfcfc" }
            }
          >
            <ModalBody
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              Etes-vous sûr que vous voulez supprimer Societe°{" "}
              {Societe && Societe.raison_sociale} ?
            </ModalBody>
            <ModalFooter
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              <button
                className="btn btn-danger"
                onClick={() => requestDelete()}
              >
                Oui
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => openCloseModalDelete()}
              >
                {" "}
                Non
              </button>
            </ModalFooter>
          </Modal>

          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .name-column--cell2": {
                color: colors.redAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
            }}
          >
            <DataGrid
              rows={data.map((Societe) => ({
                id: Societe.code_sc,
                code_sc: Societe.code_sc,
                raison_sociale: Societe.raison_sociale,
                financie: Societe.financie,
                active: Societe.active,
                site_destockage: Societe.site_destockage,
                address: Societe.address,
                user_cre: Societe.user_cre,
                gestion_depot: Societe.gestion_depot,
                responsable: Societe.responsable,
                telephone: Societe.telephone,
              }))}
              getRowId={(row) => row.code_sc}
              columns={columns}
              components={{ Toolbar: CustomToolbar }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const CustomExportButtons = (props) => (
  <GridToolbarExportContainer {...props}>
    <GridCsvExportMenuItem
      options={{
        fileName: "BD_Affectation_Vehicule_Chauffeur",
        delimiter: ";",
        utf8WithBom: true,
      }}
    />
    <GridPrintExportMenuItem
      options={{ hideFooter: true, hideToolbar: true, includeCheckboxes: true }}
    />
  </GridToolbarExportContainer>
);

const CustomToolbar = (props) => (
  <GridToolbarContainer {...props}>
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    <CustomExportButtons />
    <Box sx={{ marginLeft: "auto" }}>
      <GridToolbarQuickFilter /> {/* Ensure this is used correctly */}
    </Box>
  </GridToolbarContainer>
);

export default Societe;
