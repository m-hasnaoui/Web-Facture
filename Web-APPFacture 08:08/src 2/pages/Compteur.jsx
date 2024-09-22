import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import {
  Box,
  useTheme,
  Button,
  useMediaQuery,
  TextField,
  Alert,
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
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";

function AVALNUM() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "avalnum.php";
  const urlProfile = config.apiUrl + "profile.php";

  const [data, setData] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [dataProfile, setDataProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [AVALNUMSelected, setAVALNUMSelected] = useState({
    CODNUM: "",
    COMP: "",
    PERIODE: "",
    SITE: "",
    VALEUR: "",
    user_cre: "",
    user_upd: "",
  });

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setAVALNUMSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearSelected = () => {
    setAVALNUMSelected({
      CODNUM: "",
      COMP: "",
      PERIODE: "",
      SITE: "",
      VALEUR: "",
      user_cre: "",
      user_upd: "",
    });
  };

  const openCloseModalInsert = () => {
    clearSelected();
    setModalAdd(!modalAdd);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const requestGetProfile = async (id, page) => {
    await axios
      .get(urlProfile, {
        params: { idUser: id, page: page },
      })
      .then((response) => {
        setDataProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const requestPost = async () => {
    if (
      !AVALNUMSelected.COMP ||
      !AVALNUMSelected.PERIODE ||
      !AVALNUMSelected.SITE ||
      !AVALNUMSelected.VALEUR
    ) {
      setError(true);
      return;
    }
    var f = new FormData();
    f.append("COMP", AVALNUMSelected.COMP);
    f.append("PERIODE", AVALNUMSelected.PERIODE);
    f.append("SITE", AVALNUMSelected.SITE);
    f.append("VALEUR", AVALNUMSelected.VALEUR);
    f.append("user_cre", ReactSession.get("username"));
    f.append("METHOD", "POST");
    try {
      const response = await axios.post(url, f);
      setData(data.concat(response.data));
      openCloseModalInsert();
      clearSelected();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPut = async () => {
    var f = new FormData();
    f.append("COMP", AVALNUMSelected.COMP);
    f.append("PERIODE", AVALNUMSelected.PERIODE);
    f.append("SITE", AVALNUMSelected.SITE);
    f.append("VALEUR", AVALNUMSelected.VALEUR);
    f.append("user_upd", ReactSession.get("username"));
    f.append("METHOD", "PUT");
    try {
      await axios.post(url, f, {
        params: { CODNUM: AVALNUMSelected.CODNUM },
      });

      setData((prevData) => {
        return prevData.map((item) =>
          item.CODNUM === AVALNUMSelected.CODNUM
            ? { ...item, ...AVALNUMSelected }
            : item
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
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios
      .post(url, f, { params: { CODNUM: AVALNUMSelected.CODNUM } })
      .then((response) => {
        setData(data.filter((item) => item.CODNUM !== AVALNUMSelected.CODNUM));
        openCloseModalDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectAVALNUM = (item, choix) => {
    setAVALNUMSelected(item);
    choix === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const columns = [
    {
      field: "CODNUM",
      headerName: "CODE",
      flex: 0.1,
      cellClassName: "name-column--cell",
    },
    {
      field: "COMP",
      headerName: "Composant",
      flex: 0.3,
    },
    {
      field: "PERIODE",
      headerName: "Période",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "SITE",
      headerName: "Site",
      headerAlign: "left",
      align: "left",
      flex: 0.2,
    },
    {
      field: "VALEUR",
      headerName: "Valeur",
      headerAlign: "left",
      align: "left",
      flex: 0.25,
      cellClassName: "name-column--cell",
    },
    ...(ReactSession.get("role") === "admin"
      ? [
          {
            field: "user_cre",
            headerName: "Créé par",
            flex: 0.25,
            cellClassName: "name-column--cell2",
          },
        ]
      : []),
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",

      renderCell: (params) => {
        return [
          (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          ReactSession.get("role") == "admin" ? (
            <Tooltip title="Edit this item" arrow>
              <GridActionsCellItem
                key={`edit-${params.row.CODNUM}`}
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={() => {
                  selectAVALNUM(params.row, "Edit");
                }}
                color="inherit"
              />
            </Tooltip>
          ) : null,
          (dataProfile.length > 0 && dataProfile[0].op_delete == 1) ||
          ReactSession.get("role") == "admin" ? (
            <Tooltip title="Delete this item" arrow>
              <GridActionsCellItem
                key={`delete-${params.row.CODNUM}`}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => selectAVALNUM(params.row, "Delete")}
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
        requestGetProfile(ReactSession.get("idUser"), "AVALNUM");
        requestGet();
        await new Promise((resolve) => setTimeout(resolve, 200));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    if (!loading) {
      window.location.reload();
    }
  }, []);

  return (
    <Box m="25px">
      {loading ? (
        <Header title="Loading" subtitle="" />
      ) : (
        <Header title="Compteur" subtitle="Liste des Compteurs" />
      )}
      {loading ? null : (dataProfile.length > 0 &&
          dataProfile[0].op_add == 1) ||
        ReactSession.get("role") == "admin" ? (
        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={() => openCloseModalInsert()}
          >
            Nouveau AVALNUM
          </Button>
        </Box>
      ) : null}

      {/* Modal Add */}
      <Modal isOpen={modalAdd}>
        <ModalHeader
          toggle={() => {
            openCloseModalInsert();
          }}
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Ajouter un AVALNUM
        </ModalHeader>

        <ModalBody
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(8, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="text"
              label="Composant"
              onChange={HandleChange}
              name="COMP"
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="date"
              label="Période"
              name="PERIODE"
              onChange={HandleChange}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="text"
              onChange={HandleChange}
              label="Site"
              name="SITE"
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="number"
              onChange={HandleChange}
              label="Valeur"
              name="VALEUR"
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
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

      {/* Modal Edit */}
      <Modal isOpen={modalEdit}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Modifier un AVALNUM
        </ModalHeader>
        <ModalBody
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(8, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Composant"
              onChange={HandleChange}
              name="COMP"
              value={AVALNUMSelected && AVALNUMSelected.COMP}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="date"
              label="Période"
              onChange={HandleChange}
              name="PERIODE"
              value={AVALNUMSelected && AVALNUMSelected.PERIODE}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Site"
              onChange={HandleChange}
              name="SITE"
              value={AVALNUMSelected && AVALNUMSelected.SITE}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Valeur"
              onChange={HandleChange}
              name="VALEUR"
              value={AVALNUMSelected && AVALNUMSelected.VALEUR}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button className="btn btn-primary" onClick={() => requestPut()}>
            Modifier
          </button>{" "}
          <button
            className=" btn btn-danger"
            onClick={() => {
              openCloseModalEdit();
            }}
          >
            Fermer
          </button>
        </ModalFooter>
      </Modal>

      {/* Modal Delete */}
      <Modal isOpen={modalDelete}>
        <ModalBody
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Etes-vous sûr que vous voulez supprimer l'AVALNUM avec le code{" "}
          {AVALNUMSelected && AVALNUMSelected.CODNUM} ?
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button className="btn btn-danger" onClick={() => requestDelete()}>
            Oui
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => openCloseModalDelete()}
          >
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
          rows={data}
          getRowId={(row) => row.CODNUM}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    </Box>
  );
}

const csvOptions = {
  fileName: "BD_AVALNUM",
  delimiter: ";",
  utf8WithBom: true,
};

const printOptions = {
  hideFooter: true,
  hideToolbar: true,
  includeCheckboxes: true,
};

function CustomExportButtons(props) {
  return (
    <GridToolbarExportContainer {...props}>
      <GridCsvExportMenuItem options={csvOptions} />
      <GridPrintExportMenuItem options={printOptions} />
    </GridToolbarExportContainer>
  );
}

function CustomToolbar(props) {
  return (
    <GridToolbarContainer {...props}>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <CustomExportButtons />
      <Box sx={{ marginLeft: "auto", pl: 0, pr: 0, pb: 0, pt: 0 }}>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
}

export default AVALNUM;
