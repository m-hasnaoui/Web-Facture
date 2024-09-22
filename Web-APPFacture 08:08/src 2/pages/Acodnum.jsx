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
import {
  RemoveRedEyeOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";
import dayjs from "dayjs";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Tab from "@mui/material/Tab";
import AddCompteur from "./AddCompteur";

const ACODNUM = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "acodnum.php";

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
  //   const [DateStart, setDateStart] = useState(dayjs().add(-7, "day"));
  //   const [DateEnd, setDateEnd] = useState(dayjs());
  //   const [DataSUM, setDataSUM] = useState({ total_sum: 0 });
  const [showTotal, setShowTotal] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const [selectedAcodnum, setSelectedAcodnum] = useState({
    CODNUM: "",
    DES: "",
    LNG: "",
    NIVDEF: "",
    NIVRAZ: "",
    POSCTE: "",
    POSCTE1: "",
    POSCTE2: "",
    POSCTE3: "",
    POSCTE4: "",
    POSCTE5: "",
    POSCTE6: "",
    POSCTE7: "",
    POSCTE8: "",
    POSCTE9: "",
    Formule: "",
    POSTYP1: "",
    POSTYP2: "",
    POSTYP3: "",
    POSTYP4: "",
    POSTYP5: "",
    POSTYP6: "",
    POSTYP7: "",
    POSTYP8: "",
    POSTYP9: "",

    TYP: "",
    ZERO: false,
  });

  const requestGet = async () => {
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedAcodnum((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    // console.log(selectedAcodnum);
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

  const clearSelected = () => {
    setSelectedAcodnum({
      CODNUM: "",
      DES: "",
      LNG: "",
      NIVDEF: "",
      NIVRAZ: "",
      POSCTE: "",
      POSCTE1: "",
      POSCTE2: "",
      POSCTE3: "",
      POSCTE4: "",
      POSCTE5: "",
      POSCTE6: "",
      POSCTE7: "",
      POSCTE8: "",
      POSCTE9: "",
      Formule: "",
      POSTYP1: "",
      POSTYP2: "",
      POSTYP3: "",
      POSTYP4: "",
      POSTYP5: "",
      POSTYP6: "",
      POSTYP7: "",
      POSTYP8: "",
      POSTYP9: "",
      VAL: "",
      VAL: "",
      TYP: "",
      ZERO: false,
    });
  };

  const openCloseModalInsert = () => {
    setModalAdd(!modalAdd);
    if (!modalAdd) clearSelected();
    setError(false);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const requestPost = async () => {
    if (
      !selectedAcodnum.DES ||
      !selectedAcodnum.CODNUM ||
      !selectedAcodnum.VAL ||
      !selectedAcodnum.TYP
    ) {
      setError(true);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("METHOD", "POST"); // Make sure METHOD is included
      formData.append("DES", selectedAcodnum.DES);
      formData.append("CODNUM", selectedAcodnum.CODNUM);

      formData.append("NIVDEF", selectedAcodnum.NIVDEF);
      formData.append("NIVRAZ", selectedAcodnum.NIVRAZ);
      formData.append("VAL", selectedAcodnum.VAL);
      formData.append("TYP", selectedAcodnum.TYP);

      if (selectedAcodnum.POSCTE)
        formData.append("POSCTE", selectedAcodnum.POSCTE);
      if (selectedAcodnum.POSCTE1)
        formData.append("POSCTE1", selectedAcodnum.POSCTE1);
      if (selectedAcodnum.POSCTE3)
        formData.append("POSCTE3", selectedAcodnum.POSCTE3);
      if (selectedAcodnum.POSCTE2)
        formData.append("POSCTE2", selectedAcodnum.POSCTE2);
      if (selectedAcodnum.POSCTE4)
        formData.append("POSCTE4 ", selectedAcodnum.POSCTE4);
      if (selectedAcodnum.POSCTE5)
        formData.append("POSCTE5", selectedAcodnum.POSCTE5);
      if (selectedAcodnum.POSCTE6)
        formData.append("POSCTE6", selectedAcodnum.POSCTE6);
      if (selectedAcodnum.POSCTE7)
        formData.append("POSCTE7", selectedAcodnum.POSCTE7);
      if (selectedAcodnum.POSCTE8)
        formData.append("POSCTE8", selectedAcodnum.POSCTE8);
      if (selectedAcodnum.POSCTE9)
        formData.append("POSCTE9", selectedAcodnum.POSCTE9);

      if (selectedAcodnum.POSTYP1)
        formData.append("POSTYP1", selectedAcodnum.POSTYP1);
      if (selectedAcodnum.POSTYP2)
        formData.append("POSTYP2", selectedAcodnum.POSTYP2);
      if (selectedAcodnum.POSTYP3)
        formData.append("POSTYP3", selectedAcodnum.POSTYP3);
      if (selectedAcodnum.POSTYP4)
        formData.append("POSTYP4", selectedAcodnum.POSTYP4);
      if (selectedAcodnum.POSTYP5)
        formData.append("POSTYP5", selectedAcodnum.POSTYP5);
      if (selectedAcodnum.POSTYP6)
        formData.append("POSTYP6", selectedAcodnum.POSTYP6);
      if (selectedAcodnum.POSTYP7)
        formData.append("POSTYP7", selectedAcodnum.POSTYP7);
      if (selectedAcodnum.POSTYP8)
        formData.append("POSTYP8", selectedAcodnum.POSTYP8);
      if (selectedAcodnum.POSTYP9)
        formData.append("POSTYP9", selectedAcodnum.POSTYP9);
      if (selectedAcodnum.Formule)
        formData.append("Formule", selectedAcodnum.Formule);

      formData.append("user_cre", ReactSession.get("username"));

      console.log("Sending data:", Object.fromEntries(formData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log("Response:", response.data);

      setData(data.concat(response.data));
      clearSelected();
      requestGet();
      openCloseModalInsert();
    } catch (error) {
      console.error("Error posting data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const requestPut = async () => {
    try {
      const formData = new FormData();
      Object.keys(selectedAcodnum).forEach((key) => {
        formData.append(key, selectedAcodnum[key]);
      });
      formData.append("METHOD", "PUT");
      formData.append("UPDUSR", ReactSession.get("username"));

      await axios.post(url, formData, {
        params: { Code: selectedAcodnum.Code },
      });

      const updatedData = data.map((item) =>
        item.Code === selectedAcodnum.Code ? selectedAcodnum : item
      );
      setData(updatedData);
      openCloseModalEdit();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const requestDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("user_del", ReactSession.get("username"));

      formData.append("METHOD", "DELETE");
      await axios.post(url, formData, {
        params: {
          Code: selectedAcodnum.Code,
          user_del: ReactSession.get("username"),
        },
      });
      setData(data.filter((item) => item.Code !== selectedAcodnum.Code));
      openCloseModalDelete();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const selectAcodnum = (acodnum, action) => {
    setSelectedAcodnum(acodnum);
    action === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const columns = [
    { field: "Code", headerName: "Code", minWidth: 150 },
    { field: "CODNUM", headerName: "CODNUM", minWidth: 150 },
    { field: "DES", headerName: "Description", minWidth: 150 },
    { field: "LNG", headerName: "LNG", minWidth: 150 },
    { field: "NIVDEF", headerName: "NIVDEF", minWidth: 150 },
    { field: "NIVRAZ", headerName: "NIVRAZ", minWidth: 150 },
    {
      field: "POSCTE",
      headerName: "POSCTE",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE;
      },
    },
    {
      field: "POSCTE1",
      headerName: "POSCTE1",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE1;
      },
    },
    {
      field: "POSCTE2",
      headerName: "POSCTE2",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE2;
      },
    },
    {
      field: "POSCTE3",
      headerName: "POSCTE3",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE3;
      },
    },
    {
      field: "POSCTE4",
      headerName: "POSCTE4",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE4;
      },
    },
    {
      field: "POSCTE5",
      headerName: "POSCTE5",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE5;
      },
    },
    {
      field: "POSCTE6",
      headerName: "POSCTE6",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE6;
      },
    },
    {
      field: "POSCTE7",
      headerName: "POSCTE7",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE7;
      },
    },
    {
      field: "POSCTE8",
      headerName: "POSCTE8",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE8;
      },
    },
    {
      field: "POSCTE9",
      headerName: "POSCTE9",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.POSCTE9;
      },
    },
    {
      field: "Formule",
      headerName: "Formule",
      flex: 1,
      renderCell: (params) => {
        return params.value === null ? "Vide" : selectAcodnum.Formule;
      },
    },
    {
      field: "POSTYP1",
      headerName: "POSTYP1",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP1;
      },
    },
    {
      field: "POSTYP2",
      headerName: "POSTYP2",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP2;
      },
    },
    {
      field: "POSTYP3",
      headerName: "POSTYP3",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP3;
      },
    },
    {
      field: "POSTYP4",
      headerName: "POSTYP4",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP4;
      },
    },
    {
      field: "POSTYP5",
      headerName: "POSTYP5",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP5;
      },
    },
    {
      field: "POSTYP6",
      headerName: "POSTYP6",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP6;
      },
    },
    {
      field: "POSTYP7",
      headerName: "POSTYP7",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP7;
      },
    },
    {
      field: "POSTYP8",
      headerName: "POSTYP8",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP8;
      },
    },
    {
      field: "POSTYP9",
      headerName: "POSTYP9",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.POSTYP9;
      },
    },
    {
      field: "VAL",
      headerName: "VAL",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectAcodnum.VAL;
      },
    },
    { field: "TYP", headerName: "TYP", minWidth: 150 },
    {
      field: "ZERO",
      headerName: "ZERO",
      minWidth: 150,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      renderCell: (params) => {
        return [
          // (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          // ReactSession.get("role") == "admin" ? (
          //   <Tooltip title="Edit this item" arrow>
          //     <GridActionsCellItem
          //       key={`edit-${params.row.Code}`}
          //       icon={<EditIcon />}
          //       label="Edit"
          //       className="textPrimary"
          //       onClick={() => selectClient(params.row, "Edit")}
          //       color="inherit"
          //     />
          //   </Tooltip>
          // ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <Tooltip title="Delete this item" arrow>
              <GridActionsCellItem
                key={`delete-${params.row.Code}`}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => selectAcodnum(params.row, "Delete")}
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
        await requestGetProfile(ReactSession.get("idUser"), "Acodnum");
        await requestGet();

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  {
    /* <Header title="ACODNUM" subtitle="Managing ACODNUM entries" />
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          onClick={openCloseModalInsert}
          color="secondary"
          variant="contained"
        >
          Add New ACODNUM
        </Button>
      </Box> */
  }
  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <>
          <Header title="Compteur" subtitle="Configuration des compteurs" />
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
                  Ajouter Compteur
                </Button>
              </Box>
            </Box>
          )}

          <Modal isOpen={modalAdd} size="xl" fullscreen="md">
            <ModalHeader
              style={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? colors.primary[500]
                    : "#fcfcfc",
              }}
            >
              Ajouter ACODNUM
            </ModalHeader>
            <ModalBody
              style={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? colors.primary[500]
                    : "#fcfcfc",
              }}
            >
              <AddCompteur
                theme={theme}
                colors={colors}
                handleChange={handleChange}
                selectedAcodnum={selectedAcodnum}
                setSelectedAcodnum={setSelectedAcodnum}
              />
            </ModalBody>
            <ModalFooter
              style={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? colors.primary[500]
                    : "#fcfcfc",
              }}
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
              Etes-vous sûr que vous voulez supprimer Compteur°{" "}
              {selectedAcodnum && selectedAcodnum.BPSNUM} ?
            </ModalBody>
            <ModalFooter
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              {" "}
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
            height="100vh"
            width="93vw"
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
              autoHeight
              sx={{
                height: "94Wh",
                boxShadow: 2,
                border: 2,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              rows={data.map((Acodnum, index) => ({
                id: Acodnum.Code || `temp-id-${index}`,
                Code: Acodnum.Code,
                user_cre: Acodnum.user_cre,
                CODNUM: Acodnum.CODNUM,
                DES: Acodnum.DES,
                LNG: Acodnum.LNG,
                NIVDEF: Acodnum.NIVDEF,
                NIVRAZ: Acodnum.NIVRAZ,
                POSCTE: Acodnum.POSCTE,
                POSCTE1: Acodnum.POSCTE1,
                POSCTE2: Acodnum.POSCTE2,
                POSCTE3: Acodnum.POSCTE3,
                POSCTE4: Acodnum.POSCTE4,
                POSCTE5: Acodnum.POSCTE5,
                POSCTE6: Acodnum.POSCTE6,
                POSCTE7: Acodnum.POSCTE7,
                POSCTE8: Acodnum.POSCTE8,
                POSCTE9: Acodnum.POSCTE9,
                Formule: Acodnum.Formule,
                POSTYP1: Acodnum.POSTYP1,
                POSTYP2: Acodnum.POSTYP2,
                POSTYP3: Acodnum.POSTYP3,
                POSTYP4: Acodnum.POSTYP4,
                POSTYP5: Acodnum.POSTYP5,
                POSTYP6: Acodnum.POSTYP6,
                POSTYP7: Acodnum.POSTYP7,
                POSTYP8: Acodnum.POSTYP8,
                POSTYP9: Acodnum.POSTYP9,
                VAL: Acodnum.VAL,
                TYP: Acodnum.TYP,
                ZERO: Acodnum.ZERO,
              }))}
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

export default ACODNUM;
