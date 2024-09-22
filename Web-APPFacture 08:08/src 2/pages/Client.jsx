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
  Select,
  MenuItem,
  InputLabel,
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

const Client = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "client.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";
  const [selectedTab, setSelectedTab] = useState("1");

  const [dataProfile, setDataProfile] = useState([]);
  const [data, setData] = useState([]);
  const [dataCategore, setDataCategore] = useState([]);
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const [selectedClient, setSelectedClient] = useState({
    Code: "",
    Raison_sociale: "",
    code_client: "",
    active: false,
    devise: "",
    categorie_code: "",
    famille: "",
    ville: "",
    adresse: "",

    tell: "",
    email: "",
    contact: "",

    user_upd: "",
    user_cre: "",
    user_del: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedClient((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearSelected = () => {
    setSelectedClient({
      Code: "",
      Raison_sociale: "",
      active: false,
      devise: "",
      categorie_code: "",
      famille: "",
      ville: "",
      adresse: "",
      code_client: "",

      tell: "",
      email: "",
      contact: "",

      user_upd: "",
      user_cre: "",
      user_del: "",
      description: "",
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
    console.log("selectedClient:", selectedClient);
    console.log("categorie_code:", selectedClient?.categorie_code);
    console.log("dataCategore:", dataCategore);
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
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const requestGetCategore = async () => {
    await axios
      .get(urlSelect, {
        params: {
          description: "Client",
        },
      })
      .then((response) => {
        setDataCategore(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async () => {
    if (
      !selectedClient.devise ||
      !selectedClient.Raison_sociale ||
      !selectedClient.famille ||
      !selectedClient.adresse ||
      !selectedClient.ville ||
      !selectedClient.contact ||
      !selectedClient.email ||
      !selectedClient.tell ||
      !selectedClient.categorie_code
    ) {
      setError(true);
      console.error("Missing required fields");
      return;
    }

    const formData = new FormData();
    formData.append("famille", selectedClient.famille);
    formData.append("Raison_sociale", selectedClient.Raison_sociale);
    formData.append("adresse", selectedClient.adresse);
    formData.append("ville", selectedClient.ville);
    formData.append("contact", selectedClient.contact);
    formData.append("tell", selectedClient.tell);
    formData.append("email", selectedClient.email);
    formData.append("active", selectedClient.active ? "1" : "0");
    formData.append("categorie_code", selectedClient.categorie_code);
    formData.append("devise", selectedClient.devise);
    formData.append("user_cre", ReactSession.get("username"));
    formData.append("METHOD", "POST");

    try {
      // console.log(
      //   "Sending POST request with data:",
      //   Object.fromEntries(formData)
      // );
      const response = await axios.post(url, formData);
      // console.log("POST response:", response.data);

      if (response.data && response.data.Code) {
        setData((prevData) => [
          ...prevData,
          { ...response.data, id: response.data.Code },
        ]);
        clearSelected();
        requestGet();

        openCloseModalInsert();
        setError(false);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error in requestPost:", error);
      setError(true);
    }
  };
  const requestPut = async () => {
    const formData = new FormData();
    // const Checkgere_en_stock =
    //   selectedClient.gere_en_stock === "Oui"
    //     ? "1"
    //     : selectedClient.gere_en_stock === "Non"
    //     ? "0"
    //     : selectedClient.gere_en_stock;
    // formData.append("gere_en_stock", Checkgere_en_stock);
    // const Checkactive =
    //   selectedClient.active === "Oui"
    //     ? "1"
    //     : selectedClient.active === "Non"
    //     ? "0"
    //     : selectedClient.active;
    // formData.append("active", Checkactive);

    formData.append("Raison_sociale", selectedClient.Raison_sociale);
    formData.append("categorie_code", selectedClient.categorie_code);
    formData.append("devise", selectedClient.devise);

    formData.append("active", selectedClient.active ? "1" : "0");
    formData.append("ville", selectedClient.ville);
    formData.append("adresse", selectedClient.adresse);
    formData.append("famille", selectedClient.famille);
    formData.append("email", selectedClient.email);
    formData.append("tell", selectedClient.tell);
    formData.append("contact", selectedClient.contact);

    formData.append("user_upd", ReactSession.get("username"));

    formData.append("METHOD", "PUT");

    try {
      await axios.post(url, formData, {
        params: { Code: selectedClient.Code },
      });

      setData((prevData) => {
        return prevData.map((Client) =>
          Client.Code === selectedClient.Code
            ? { ...Client, ...selectedClient }
            : Client
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
          Code: selectedClient.Code,
          user_del: ReactSession.get("username"),
        },
      });
      setData(data.filter((Client) => Client.Code !== selectedClient.Code));
      openCloseModalDelete();
    } catch (error) {
      console.error(error);
    }
  };

  const selectClient = (Client, action) => {
    setSelectedClient(Client);
    action === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const columns = [
    { field: "Code", headerName: "ID", flex: 0.5 },
    {
      field: "code_client",
      headerName: "Code Client",
      flex: 1,
    },
    {
      field: "Raison_sociale",
      headerName: "Raison Sociale",
      flex: 1,
    },
    {
      field: "ville",
      headerName: "Ville",
      flex: 1,
    },
    {
      field: "adresse",
      headerName: "Adresse",
      flex: 1,
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
      field: "devise",
      headerName: "Devise",
      flex: 1,
    },

    { field: "famille", headerName: "Famille", flex: 1 },
    { field: "categorie_code", headerName: "Categorie", flex: 1 },

    { field: "contact", headerName: "Contact", flex: 1 },
    { field: "tell", headerName: "Téléphone", flex: 1 },

    { field: "email", headerName: "Email", flex: 1 },

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
                key={`edit-${params.row.Code}`}
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={() => selectClient(params.row, "Edit")}
                color="inherit"
              />
            </Tooltip>
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <Tooltip title="Delete this item" arrow>
              <GridActionsCellItem
                key={`delete-${params.row.Code}`}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => selectClient(params.row, "Delete")}
                color="inherit"
              />
            </Tooltip>
          ) : null,
        ];
      },
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        await requestGetProfile(ReactSession.get("idUser"), "Client");
        await requestGet();
        await requestGetCategore();

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         await requestGetProfile(ReactSession.get("idUser"), "Client");
  //         await requestGet();
  //         // await console.log(
  //         //   ReactSession.get("visibility").filter((item) => item.page)
  //         // );

  //         setLoading(false);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // console.log(ReactSession.get('idUser'));
  //       requestGetProfile(ReactSession.get("idUser"), "Client");
  //       requestGet();
  //       // console.log(dataProfile[0]);
  //       await new Promise((resolve) => setTimeout(resolve, 200));
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  //   if (!loading) {
  //     window.location.reload();
  //   }
  // }, []);

  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <>
          <Header title="Clients" subtitle="List des Client" />
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
                  Nouvelle Client
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
              Ajouter Client
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
                  <TabList onChange={handleTabChange} aria-label="Client tabs">
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
                      type="text"
                      variant="filled"
                      label="ville"
                      onChange={handleChange}
                      name="ville"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      color="secondary"
                      fullWidth
                      variant="filled"
                      label="famille"
                      onChange={handleChange}
                      name="famille"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      type="text"
                      variant="filled"
                      label="Adresse"
                      onChange={handleChange}
                      name="adresse"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      type="text"
                      variant="filled"
                      label="tell"
                      onChange={handleChange}
                      name="tell"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      type="text"
                      variant="filled"
                      label="email"
                      onChange={handleChange}
                      name="email"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      type="text"
                      variant="filled"
                      label="contact"
                      onChange={handleChange}
                      name="contact"
                      sx={{ gridColumn: "span 4" }}
                    />

                    <FormControl
                      component="fieldset"
                      sx={{ gridColumn: "span 4" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={selectedClient.active}
                            onChange={handleChange}
                            name="active"
                          />
                        }
                        label="active"
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
                      label="Raison sociale"
                      onChange={handleChange}
                      name="Raison_sociale"
                      sx={{ gridColumn: "span 6" }}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      color="secondary"
                      variant="filled"
                      label="devise"
                      onChange={handleChange}
                      name="devise"
                      sx={{ gridColumn: "span 6" }}
                    />

                    {/* <TextField
                      color="secondary"
                      fullWidth
                      variant="filled"
                      label="categorie_code"
                      onChange={handleChange}
                      name="categorie_code"
                      sx={{ gridColumn: "span 6" }}
                    /> */}
                    <TextField
                      fullWidth
                      variant="filled"
                      select
                      label={
                        dataCategore.length > 0
                          ? "Categore"
                          : "pas  Categore disponibles"
                      }
                      onChange={handleChange}
                      name="categorie_code"
                      SelectProps={{
                        native: true,
                      }}
                      // disabled= {dataTrajectory.length > 0 ? false : true}
                      sx={{ gridColumn: "span 8" }}
                    >
                      {dataCategore.length > 0 ? (
                        <option value="" selected hidden disabled>
                          Choisissez Categore
                        </option>
                      ) : null}
                      {dataCategore.map((categorie) => (
                        <option value={categorie.Code} key={categorie.Code}>
                          {categorie.description}
                        </option>
                      ))}
                    </TextField>
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
              Modifier Client
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
                  <TabList onChange={handleTabChange} aria-label="Client tabs">
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
                      label="ville"
                      name="ville"
                      value={selectedClient.ville}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="adresse"
                      name="adresse"
                      value={selectedClient.adresse}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="famille"
                      name="famille"
                      value={selectedClient.famille}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Contact"
                      name="contact"
                      value={selectedClient.contact}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Tell"
                      name="tell"
                      value={selectedClient.tell}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Email"
                      name="email"
                      value={selectedClient.email}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedClient.active}
                          onChange={handleChange}
                          name="active"
                          color="secondary"
                        />
                      }
                      label="active"
                      sx={{ gridColumn: "span 4" }}
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
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Raison Sociale"
                      name="Raison_sociale"
                      value={selectedClient.Raison_sociale}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 8" }}
                    />
                    {/* Add additional fields as needed for Details tab */}
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="devise"
                      name="devise"
                      value={selectedClient.devise}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />

                    {/* <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Categorie"
                      name="categorie_code"
                      value={selectedClient.categorie_code}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="categorie_code-label">
                        {selectedClient.categorie_code}
                      </InputLabel>
                    </FormControl>
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
              Etes-vous sûr que vous voulez supprimer Client°{" "}
              {Client && Client.Raison_sociale} ?
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
              rows={
                data.length >= 0
                  ? data.map((Client, index) => {
                      return {
                        id: index,
                        Code: Client.Code,
                        code_client: Client.code_client,
                        Raison_sociale: Client.Raison_sociale,
                        categorie_code: Client.description,
                        devise: Client.devise,
                        description: Client.description,

                        active: Client.active,
                        adresse: Client.adresse,
                        ville: Client.ville,
                        famille: Client.famille,
                        tell: Client.tell,
                        email: Client.email,
                        contact: Client.contact,

                        user_cre: Client.user_cre,
                      };
                    })
                  : []
              }
              getRowId={(row) => row.Code}
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

export default Client;
