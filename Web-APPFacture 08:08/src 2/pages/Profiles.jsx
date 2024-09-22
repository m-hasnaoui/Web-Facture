import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  Box,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import Header from "../components/Header";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
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
import { Message } from "@mui/icons-material";
import config from "./global/config";
import { ReactSession } from "react-client-session";

function Profile() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "profile.php";
  const urlSelect = config.apiUrl + "selection.php";

  const [data, setData] = useState([]);
  const [dataSelectProfile, setDataSelectProfile] = useState([]);
  const [dataSelectPage, setDataSelectPage] = useState([]);
  const [profileSelected, setProfileSelected] = useState({
    idAPU: "",
    profile: "",
    page: "",
    op_add: "",
    op_edit: "",
    op_delete: "",
    user_cre: "",
    username: "",
  });

  const clearSelected = () => {
    setProfileSelected({
      idAPU: "",
      profile: "",
      page: "",
      op_add: "",
      op_edit: "",
      op_delete: "",
    });
    setData([]);
  };

  const [empty, setEmpty] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);

  const openCloseModalInsert = () => {
    setModalAdd(!modalAdd);
    requestGetSelectPage(profileSelected.profile);
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setProfileSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(profileSelected);
  };

  const requestGet = async (profile) => {
    await axios
      .get(url, {
        params: { profile: profile },
      })
      .then((response) => {
        setData(response.data);
        if (!response.data || response.data.length < 8) {
          setEmpty(true);
        } else {
          setEmpty(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async (profile, page) => {
    var f = new FormData();
    f.append("profile", profile);
    f.append("page", page);
    f.append("idUser", ReactSession.get("idUser"));
    f.append("user_cre", ReactSession.get("username"));
    // f.append("visibility", 0);
    // f.append("op_add", 0);
    // f.append("op_edit", 0);
    // f.append("op_delete", 0);
    f.append("METHOD", "POST");
    await axios
      .post(url, f)
      .then((response) => {
        // setData(response.data);
        requestGet(profile);
        openCloseModalInsert();
        // clearSelected();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const requestPut = async () => {
  //   var formData = new FormData();
  //   formData.append("idAPU", profileSelected.idAPU);
  //   formData.append("profile", profileSelected.profile);
  //   formData.append("page", profileSelected.page);
  //   formData.append("op_add", profileSelected.op_add);
  //   formData.append("op_edit", profileSelected.op_edit);
  //   formData.append("op_delete", profileSelected.op_delete);
  //   formData.append("METHOD", "PUT");
  //   try {
  //     await axios.post(url, formData, {
  //       params: { profile: profileSelected.profile },
  //     });

  //     setData((prevData) => {
  //       return prevData.map((user) =>
  //         user.profile === profileSelected.profile
  //           ? { ...user, ...profileSelected }
  //           : user
  //       );
  //     });

  //     requestGet(profileSelected.profile);
  //     clearSelected();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const requestPutOp = async (row) => {
    var formData = new FormData();
    formData.append("idAPU", row.idAPU);
    formData.append("visibility", row.visibility);
    formData.append("op_add", row.op_add);
    formData.append("op_edit", row.op_edit);
    formData.append("op_delete", row.op_delete);
    formData.append("user_upd", ReactSession.get("username"));

    formData.append("METHOD", "PUT");
    try {
      await axios.post(url, formData, {
        params: { idAPU: row.idAPU, op: "" },
      });

      setData((prevData) => {
        return prevData.map((user) =>
          user.profile === profileSelected.profile
            ? { ...user, ...profileSelected }
            : user
        );
      });

      requestGet(row.profile);
      clearSelected();
    } catch (error) {
      console.error(error);
    }
  };

  const requestGetSelectProfile = async () => {
    await axios
      .get(urlSelect, {
        params: { profile: "" },
      })
      .then((response) => {
        setDataSelectProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestGetSelectPage = async (profile) => {
    await axios
      .get(urlSelect, {
        params: { pages: "", profileV2: profile },
      })
      .then((response) => {
        setDataSelectPage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const OperationV = ({ row }) => {
    return (
      <Checkbox
        checked={row.visibility == "1" ? true : false}
        onChange={(e) => {
          row.visibility == "1" ? (row.visibility = 0) : (row.visibility = 1);
          requestPutOp(row);
        }}
        inputProps={{ "aria-label": "value" }}
        sx={{ flex: 1 }}
      />
    );
  };

  const OperationAdd = ({ row }) => {
    return (
      <Checkbox
        checked={row.op_add == "1" ? true : false}
        onChange={(e) => {
          row.op_add == "1" ? (row.op_add = 0) : (row.op_add = 1);
          requestPutOp(row);
        }}
        inputProps={{ "aria-label": "value" }}
        sx={{ flex: 1 }}
      />
    );
  };

  const OperationEdit = ({ row }) => {
    return (
      <Checkbox
        checked={row.op_edit == "1" ? true : false}
        onChange={(e) => {
          row.op_edit == "1" ? (row.op_edit = 0) : (row.op_edit = 1);
          requestPutOp(row);
        }}
        inputProps={{ "aria-label": "value" }}
        sx={{ flex: 1 }}
      />
    );
  };

  const OperationDelete = ({ row }) => {
    return (
      <Checkbox
        checked={row.op_delete == "1" ? true : false}
        onChange={(e) => {
          row.op_delete == "1" ? (row.op_delete = 0) : (row.op_delete = 1);
          requestPutOp(row);
        }}
        inputProps={{ "aria-label": "value" }}
        sx={{ flex: 1 }}
      />
    );
  };

  useEffect(() => {
    requestGetSelectProfile();
  }, []);

  const columns = [
    {
      field: "idAPU",
      headerName: "ID",
      flex: 0.5,
      cellClassName: "name-column--cell2",
    },
    {
      field: "page",
      headerName: "Page",
      flex: 1.5,
    },
    {
      field: "visibility",
      headerName: "Visibilité",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => <OperationV row={params.row} />,
    },
    {
      field: "op_add",
      headerName: "rôle d'ajout",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => <OperationAdd row={params.row} />,
    },
    {
      field: "op_edit",
      headerName: "rôle de modification",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => <OperationEdit row={params.row} />,
    },
    {
      field: "op_delete",
      headerName: "rôle de supprission",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => <OperationDelete row={params.row} />,
    },
  ];

  return (
    <Box m="25px">
      <Header title="Profile" subtitle="Liste des Profiles" />
      <Modal isOpen={modalAdd}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Ajouter des permissions{" "}
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
              label="Profile"
              // onBlur={handleBlur}
              onChange={HandleChange}
              name="page"
              disabled
              defaultValue={profileSelected.profile}
              // error={!!touched.firstName && !!errors.firstName}
              // helperText={touched.firstName && errors.firstName}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              select
              label="Page"
              onChange={HandleChange}
              name="page"
              SelectProps={{
                native: true,
              }}
              sx={{ gridColumn: "span 4" }}
            >
              {dataSelectPage.length > 0 && (
                <option value="" selected hidden disabled></option>
              )}
              {dataSelectPage.map((item) => (
                <option value={item.page} key={item.page}>
                  {item.page}
                </option>
              ))}
            </TextField>
          </Box>
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button
            className="btn btn-primary"
            onClick={() =>
              requestPost(profileSelected.profile, profileSelected.page)
            }
          >
            Ajouter
          </button>{" "}
          <button
            className=" btn btn-danger"
            onClick={() => openCloseModalInsert()}
          >
            Fermer
          </button>
        </ModalFooter>
      </Modal>
      <Box
        m="20px"
        display="flex"
        justifyContent="center"
        mt="20px"
        ml="500px"
        mr="500px"
      >
        <TextField
          fullWidth
          variant="filled"
          select
          label="Profiles"
          onChange={(e) => {
            clearSelected();
            requestGet(e.target.value);
            HandleChange(e);
          }}
          name="profile"
          SelectProps={{
            native: true,
          }}
          sx={{ gridColumn: "span 4" }}
        >
          {dataSelectProfile.length > 0 ? (
            <option value="" selected hidden disabled>
              Choisissez un Profile
            </option>
          ) : null}
          {dataSelectProfile.map((item) => (
            <option value={item.profile} key={item.profile}>
              {item.profile}
            </option>
          ))}
        </TextField>
      </Box>
      {empty ? (
        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={() => openCloseModalInsert()}
          >
            Nouveau des permissions
          </Button>
        </Box>
      ) : null}
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
        <Box
          display="grid"
          gridTemplateColumns="repeat(9, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        ></Box>

        <DataGrid
          rows={
            data && data.length >= 0
              ? data.map((profile) => {
                  return {
                    id: profile.idAPU,
                    idAPU: profile.idAPU,
                    profile: profile.profile,
                    page: profile.page,
                    visibility: profile.visibility,
                    op_add: profile.op_add,
                    op_edit: profile.op_edit,
                    op_delete: profile.op_delete,
                  };
                })
              : []
          }
          getRowId={(row) => row.id}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </Box>
  );
}

const csvOptions = {
  fileName: "BD_Profile",
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
      {/* <GridToolbarFilterButton /> */}
      <GridToolbarDensitySelector />
      <CustomExportButtons />
      <Box
        sx={{
          marginLeft: "auto",
          pl: 0,
          pr: 0,
          pb: 0,
          pt: 0,
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
}

export default Profile;
