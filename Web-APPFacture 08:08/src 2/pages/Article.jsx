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
  InputLabel,
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

const Article = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "article.php";
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
  const [dataCategore, setDataCategore] = useState([]);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [DateStart, setDateStart] = useState(dayjs().add(-7, "day"));
  const [DateEnd, setDateEnd] = useState(dayjs());
  const [DataSUM, setDataSUM] = useState({ total_sum: 0 });
  const [showTotal, setShowTotal] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState({
    Code_art: "",
    designation: "",
    categorie_code: "",
    gere_en_stock: false,
    gere_par_lot: false,
    tax: "",
    unite_de_vente: "",
    unite_d_achat: "",
    conversion_stock: "",
    conversion_stock_2: "",

    user_upd: "",
    user_cre: "",
    user_del: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedArticle((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    // console.log(selectedArticle);
  };

  const clearSelected = () => {
    setSelectedArticle({
      Code_art: "",
      designation: "",
      categorie_code: "",

      gere_en_stock: false,
      gere_par_lot: false,
      tax: "",
      unite_de_vente: "",
      unite_d_achat: "",
      conversion_stock: "",
      conversion_stock_2: "",

      user_upd: "",
      user_cre: "",
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
          description: "Article",
        },
      })
      .then((response) => {
        setDataCategore(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async () => {
    if (
      !selectedArticle.designation ||
      !selectedArticle.tax ||
      !selectedArticle.unite_d_achat ||
      !selectedArticle.conversion_stock_2 ||
      !selectedArticle.conversion_stock ||
      !selectedArticle.unite_de_vente ||
      !selectedArticle.categorie_code
    ) {
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append("designation", selectedArticle.designation);
    formData.append("unite_d_achat", selectedArticle.unite_d_achat);
    formData.append("conversion_stock_2", selectedArticle.conversion_stock_2);
    formData.append("conversion_stock", selectedArticle.conversion_stock);
    formData.append("gere_en_stock", selectedArticle.gere_en_stock ? "1" : "0");
    formData.append("gere_par_lot", selectedArticle.gere_par_lot ? "1" : "0");
    formData.append("unite_de_vente", selectedArticle.unite_de_vente);
    formData.append("tax", selectedArticle.tax);
    formData.append("categorie_code", selectedArticle.categorie_code);

    formData.append("user_cre", ReactSession.get("username"));
    formData.append("METHOD", "POST");

    try {
      const response = await axios.post(url, formData);
      //   setData([...data, response.data]);
      setData(data.concat(response.data));
      console.log(response.data);

      clearSelected();
      requestGet();
      openCloseModalInsert();
    } catch (error) {
      console.error(error);
    }
  };
  const requestPut = async () => {
    const formData = new FormData();
    // const Checkgere_en_stock =
    //   selectedArticle.gere_en_stock === "Oui"
    //     ? "1"
    //     : selectedArticle.gere_en_stock === "Non"
    //     ? "0"
    //     : selectedArticle.gere_en_stock;
    // formData.append("gere_en_stock", Checkgere_en_stock);
    // const Checkgere_par_lot =
    //   selectedArticle.gere_par_lot === "Oui"
    //     ? "1"
    //     : selectedArticle.gere_par_lot === "Non"
    //     ? "0"
    //     : selectedArticle.gere_par_lot;
    // formData.append("gere_par_lot", Checkgere_par_lot);

    formData.append("designation", selectedArticle.designation);
    formData.append("gere_en_stock", selectedArticle.gere_en_stock ? "1" : "0");
    formData.append("gere_par_lot", selectedArticle.gere_par_lot ? "1" : "0");

    formData.append("tax", selectedArticle.tax);
    formData.append("conversion_stock", selectedArticle.conversion_stock);
    formData.append("conversion_stock_2", selectedArticle.conversion_stock_2);

    formData.append("unite_d_achat", selectedArticle.unite_d_achat);
    formData.append("unite_de_vente", selectedArticle.unite_de_vente);
    formData.append("user_upd", ReactSession.get("username"));

    formData.append("METHOD", "PUT");

    try {
      await axios.post(url, formData, {
        params: { Code_art: selectedArticle.Code_art },
      });

      setData((prevData) => {
        return prevData.map((Article) =>
          Article.Code_art === selectedArticle.Code_art
            ? { ...Article, ...selectedArticle }
            : Article
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
          Code_art: selectedArticle.Code_art,
          user_del: ReactSession.get("username"),
        },
      });
      setData(
        data.filter((Article) => Article.Code_art !== selectedArticle.Code_art)
      );
      openCloseModalDelete();
      requestGetSum(DateStart, DateEnd);
    } catch (error) {
      console.error(error);
    }
  };

  const selectArticle = (Article, action) => {
    setSelectedArticle(Article);
    action === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const columns = [
    { field: "Code_art", headerName: "ID", flex: 0.5 },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
    },
    { field: "description", headerName: "Categorie", flex: 1 },

    {
      field: "conversion_stock",
      headerName: "Conversion Stock",
      flex: 1,
    },
    {
      field: "conversion_stock_2",
      headerName: "Conversion Stock 2",
      flex: 1,
    },
    {
      field: "gere_par_lot",
      headerName: "Gere Par Lot",
      flex: 1,
      renderCell: (params) => {
        return params.value === 1 ? "Oui" : "Non";
      },
    },
    {
      field: "gere_en_stock",
      headerName: "Gere En Stock",
      flex: 1,
      renderCell: (params) => {
        return params.value === 1 ? "Oui" : "Non";
      },
    },
    {
      field: "tax",
      headerName: "tax",
      flex: 1,
    },

    { field: "unite_d_achat", headerName: "Unite D'achat", flex: 1 },
    { field: "unite_de_vente", headerName: "Unite De Vente", flex: 1 },

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
                key={`edit-${params.row.Code_art}`}
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={() => selectArticle(params.row, "Edit")}
                color="inherit"
                //   disabled={true}
              />
            </Tooltip>
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <Tooltip title="Edit this item" arrow>
              <GridActionsCellItem
                key={`delete-${params.row.Code_art}`}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => selectArticle(params.row, "Delete")}
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
        await requestGetProfile(ReactSession.get("idUser"), "Article");
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // console.log(ReactSession.get('idUser'));
  //       requestGetProfile(ReactSession.get("idUser"), "Article");
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
          <Header title="Articles" subtitle="List des Article" />
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
                  Nouvelle Article
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
              Ajouter Article
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
                  <TabList onChange={handleTabChange} aria-label="Article tabs">
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
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Désignation"
                      onChange={handleChange}
                      name="designation"
                      sx={{ gridColumn: "span 8" }}
                    />

                    <FormControl
                      component="fieldset"
                      sx={{ gridColumn: "span 4" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={selectedArticle.gere_en_stock}
                            onChange={handleChange}
                            name="gere_en_stock"
                          />
                        }
                        label="gere_en_stock"
                      />
                    </FormControl>
                    <FormControl
                      component="fieldset"
                      sx={{ gridColumn: "span 4" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={selectedArticle.gere_par_lot}
                            onChange={handleChange}
                            name="gere_par_lot"
                          />
                        }
                        label="gere_par_lot"
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
                      type="number"
                      color="secondary"
                      variant="filled"
                      label="tax"
                      onChange={handleChange}
                      name="tax"
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      type="number"
                      variant="filled"
                      label="Conversion_stock"
                      onChange={handleChange}
                      name="conversion_stock"
                      sx={{ gridColumn: "span 3" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      type="number"
                      variant="filled"
                      label="Conversion_stock 2"
                      onChange={handleChange}
                      name="conversion_stock_2"
                      sx={{ gridColumn: "span 3" }}
                    />
                    <TextField
                      color="secondary"
                      fullWidth
                      variant="filled"
                      label="unite_de_vente"
                      onChange={handleChange}
                      name="unite_de_vente"
                      sx={{ gridColumn: "span 8" }}
                    />
                    <TextField
                      color="secondary"
                      fullWidth
                      variant="filled"
                      label="unite_d_achat"
                      onChange={handleChange}
                      name="unite_d_achat"
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
              Modifier Article
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
                  <TabList onChange={handleTabChange} aria-label="Article tabs">
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
                      name="designation"
                      value={selectedArticle.designation}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 8" }}
                    />
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="categorie_code-label">
                        {selectedArticle.categorie_code}
                      </InputLabel>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedArticle.gere_en_stock}
                          onChange={handleChange}
                          name="gere_en_stock"
                          color="secondary"
                        />
                      }
                      label="gere_en_stock"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedArticle.gere_par_lot}
                          onChange={handleChange}
                          name="gere_par_lot"
                          color="secondary"
                        />
                      }
                      label="gere_par_lot"
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
                    {/* Add additional fields as needed for Details tab */}
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="TAX"
                      name="tax"
                      value={selectedArticle.tax}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Conversion_stock"
                      name="conversion_stock"
                      value={selectedArticle.conversion_stock}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 3" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Conversion_stock_2"
                      name="conversion_stock_2"
                      value={selectedArticle.conversion_stock_2}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 3" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="unite_d_achat"
                      name="unite_d_achat"
                      value={selectedArticle.unite_d_achat}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 8" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Téléphone"
                      name="unite_de_vente"
                      value={selectedArticle.unite_de_vente}
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
              Etes-vous sûr que vous voulez supprimer Article°{" "}
              {Article && Article.designation} ?
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
              rows={data.map((Article) => ({
                id: Article.Code_art,
                Code_art: Article.Code_art,
                description: Article.description,

                designation: Article.designation,
                gere_en_stock: Article.gere_en_stock,
                gere_par_lot: Article.gere_par_lot,
                tax: Article.tax,
                categorie_code: Article.categorie_code,
                user_cre: Article.user_cre,
                conversion_stock_2: Article.conversion_stock_2,
                conversion_stock: Article.conversion_stock,
                unite_d_achat: Article.unite_d_achat,
                unite_de_vente: Article.unite_de_vente,
              }))}
              getRowId={(row) => row.Code_art}
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

export default Article;
