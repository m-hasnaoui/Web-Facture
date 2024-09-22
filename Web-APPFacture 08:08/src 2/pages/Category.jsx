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
  FormControlLabel,
  Checkbox,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

function Category() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "category.php";
  const urlselect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";

  const [data, setData] = useState([]);
  const [dataCompteur, setDataCompteur] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [dataProfile, setDataProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [categorySelected, setCategorySelected] = useState({
    Code: "",
    tier: "",
    type: "",
    description: "",
    CODNUM: "",
    user_cre: "",
    user_upd: "",
  });

  const [tierOptions, setTierOptions] = useState([
    { value: "Client", label: "Client" },
    { value: "Fournisseur", label: "Fournisseur" },
  ]);
  const HandleChange = (e) => {
    const { name, value } = e.target;
    setCategorySelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearSelected = () => {
    setCategorySelected({
      Code: "",
      tier: "",
      type: "",
      description: "",
      CODNUM: "",
      user_cre: "",
      user_upd: "",
    });
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const requestGetCompteur = async () => {
    await axios
      .get(urlselect, {
        params: { category_codnum: "" },
      })
      .then((response) => {
        setDataCompteur(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async () => {
    if (
      !categorySelected.tier ||
      !categorySelected.type ||
      !categorySelected.CODNUM
    ) {
      setError(true);
      return;
    }
    var f = new FormData();
    f.append("tier", categorySelected.tier);
    f.append("type", categorySelected.type);
    f.append("description", categorySelected.description);
    f.append("CODNUM", categorySelected.CODNUM);
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
    f.append("tier", categorySelected.tier);
    f.append("type", categorySelected.type);
    f.append("description", categorySelected.description);
    f.append("CODNUM", categorySelected.CODNUM);
    f.append("user_upd", ReactSession.get("username"));
    f.append("METHOD", "PUT");
    try {
      await axios.post(url, f, {
        params: { Code: categorySelected.Code },
      });

      setData((prevData) => {
        return prevData.map((category) =>
          category.Code === categorySelected.Code
            ? { ...category, ...categorySelected }
            : category
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
      .post(url, f, { params: { Code: categorySelected.Code } })
      .then((response) => {
        setData(
          data.filter((category) => category.Code !== categorySelected.Code)
        );
        openCloseModalDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectCategory = (category, choix) => {
    setCategorySelected(category);
    choix === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
  };

  const columns = [
    {
      field: "Code",
      headerName: "Code",
      flex: 0.1,
      cellClassName: "name-column--cell",
    },
    {
      field: "tier",
      headerName: "Tier",
      flex: 0.3,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.3,
    },
    {
      field: "CODNUM",
      headerName: "CODNUM",
      flex: 0.2,
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
                key={`edit-${params.row.Code}`}
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={() => {
                  selectCategory(params.row, "Edit");
                }}
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
                onClick={() => selectCategory(params.row, "Delete")}
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
        requestGetProfile(ReactSession.get("idUser"), "Category");
        requestGet();
        requestGetCompteur();
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
        <Header title="Catégorie" subtitle="Liste des Catégories" />
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
            Nouvelle Catégorie
          </Button>
        </Box>
      ) : null}
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
          Ajouter une Catégorie{" "}
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
            <FormControl
              fullWidth
              variant="filled"
              sx={{ gridColumn: "span 4" }}
            >
              <InputLabel id="tier-label">Tier</InputLabel>
              <Select
                labelId="tier-label"
                id="tier-select"
                value={categorySelected.tier}
                onChange={HandleChange}
                name="tier"
              >
                {tierOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="text"
              label="Type"
              name="type"
              onChange={HandleChange}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="text"
              onChange={HandleChange}
              label="Description"
              name="description"
              sx={{ gridColumn: "span 4" }}
            />

            {/* <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="text"
              onChange={HandleChange}
              label="CODNUM"
              name="CODNUM"
              sx={{ gridColumn: "span 4" }}
            /> */}
            <FormControl
              fullWidth
              variant="filled"
              sx={{ gridColumn: "span 4" }}
            >
              <InputLabel id="compteur-label">Compteur</InputLabel>
              <Select
                labelId="compteur-label"
                id="compteur-select"
                value={categorySelected.CODNUM}
                onChange={HandleChange}
                name="CODNUM"
              >
                {dataCompteur.map((option) => (
                  <MenuItem key={option.CODNUM} value={option.CODNUM}>
                    {option.CODNUM}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

      <Modal isOpen={modalEdit}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Modifier une Catégorie{" "}
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
            <FormControl
              fullWidth
              variant="filled"
              sx={{ gridColumn: "span 4" }}
            >
              <InputLabel id="tier-label">Tier</InputLabel>
              <Select
                labelId="tier-label"
                id="tier-select"
                value={categorySelected.tier}
                onChange={HandleChange}
                name="tier"
              >
                {tierOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Type"
              onChange={HandleChange}
              name="type"
              value={categorySelected && categorySelected.type}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Description"
              onChange={HandleChange}
              name="description"
              value={categorySelected && categorySelected.description}
              sx={{ gridColumn: "span 4" }}
            />

            <FormControl
              fullWidth
              variant="filled"
              sx={{ gridColumn: "span 4" }}
            >
              <InputLabel id="compteur-label">Compteur</InputLabel>
              <Select
                labelId="compteur-label"
                id="compteur-select"
                value={categorySelected.CODNUM}
                onChange={HandleChange}
                name="CODNUM"
              >
                {dataCompteur.map((option) => (
                  <MenuItem key={option.CODNUM} value={option.CODNUM}>
                    {option.CODNUM}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          Etes-vous sûr que vous voulez supprimer la catégorie{" "}
          {categorySelected && categorySelected.description} ?
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
            onClick={() => {
              if (
                window.confirm(
                  "Cette catégorie peut exister dans d'autres tableaux, êtes-vous sûr de vouloir la supprimer ?"
                )
              ) {
                requestDelete();
              }
            }}
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
          rows={data}
          getRowId={(row) => row.Code}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    </Box>
  );
}

const csvOptions = {
  fileName: "BD_Category",
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

export default Category;
