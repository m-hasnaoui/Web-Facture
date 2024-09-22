import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputBase,
  TextField,
  useMediaQuery,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PasswordIcon from "@mui/icons-material/Password";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import config from "./global/config";
import { ReactSession } from "react-client-session";

function User() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const url = config.apiUrl + "user.php";
  const urlU = "https://imlasoftservices.website/backend/updates.php";
  // const urlU = "http://localhost/backend/updates.php";

  // config.apiUrl + "updates.php";
  const urlRole = config.apiUrl + "role.php";
  const urlSelect = config.apiUrl + "selection.php";
  // const urlDeposit = config.apiUrl + "deposit.php";

  const [data, setData] = useState([]);
  const [dataRole, setDataRole] = useState([]);
  const [dataProfile, setDataProfile] = useState([]);
  // const [dataDeposit, setDataDeposit] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalEditPassword, setModalEditPassword] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [UserSelected, setUserSelected] = useState({
    idUser: "",
    username: "",
    password: "",
    profile: "",
    role: "",
    // deposit: "",
    user_cre: "",
    user_upd: "",
    active: false,
    first_login: false,
  });
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const openCloseModalEditPassword = () => {
    setModalEditPassword(!modalEditPassword);
    setError(""); // Clear any previous errors
    setShowPassword(false); // Reset password visibility
    setShowConfirmPassword(false); // Reset confirm password visibility
  };
  const handleChangePassword = async () => {
    if (UserSelected.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError(""); // Clear any previous errors

    var formData = new FormData();
    formData.append("password", UserSelected.password);
    formData.append("user_upd", ReactSession.get("username"));
    formData.append("first_login", UserSelected.first_login ? "1" : "0");
    formData.append("METHOD", "PUT");

    try {
      await axios.post(urlU, formData, {
        params: { idUser: UserSelected.idUser },
      });

      setData((prevData) =>
        prevData.map((user) =>
          user.idUser === UserSelected.idUser
            ? { ...user, ...UserSelected }
            : user
        )
      );

      requestGet();
      openCloseModalEditPassword();
      clearSelected();
    } catch (error) {
      console.error(error);
      setError(
        "Une erreur s'est produite lors de la modification du mot de passe."
      );
    }
  };

  const HandleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSelected((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const PasswordField = ({ value }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
      <InputBase
        type={showPassword ? "text" : "password"}
        value={value}
        fullWidth
        readOnly
        onClick={handleTogglePasswordVisibility}
        // endAdornment={
        //   <IconButton onClick={handleTogglePasswordVisibility}>
        //     {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        //   </IconButton>
        // }
        sx={{ ml: 1, flex: 1 }}
      />
    );
  };

  const clearSelected = () => {
    setUserSelected({
      idUser: "",
      username: "",
      password: "",
      profile: "",
      role: "",
      // deposit: "",
      user_cre: "",

      user_upd: "",
      active: false,
      first_login: false,
    });
  };

  const openCloseModalInsert = () => {
    setModalAdd(!modalAdd);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
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

  const requestGetRole = async () => {
    await axios
      .get(urlRole)
      .then((response) => {
        setDataRole(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestGetProfile = async () => {
    await axios
      .get(urlSelect, { params: { profile: "" } })
      .then((response) => {
        setDataProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestGetDeposit = async () => {
    await axios
      .get(urlDeposit)
      .then((response) => {
        setDataDeposit(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPost = async () => {
    var f = new FormData();
    f.append("username", UserSelected.username);
    f.append("password", UserSelected.password);
    f.append("profile", UserSelected.profile);
    f.append("role", UserSelected.role);
    f.append("user_cre", ReactSession.get("username"));

    // f.append("deposit", UserSelected.deposit);
    f.append("active", 1);
    f.append("METHOD", "POST");
    try {
      const response = await axios.post(url, f);
      console.log(response.data);
      setData(data.concat(response.data));
      requestGet();
      openCloseModalInsert();
      clearSelected();
    } catch (error) {
      console.error(error);
    }
  };

  const requestPut = async () => {
    var formData = new FormData();
    formData.append("username", UserSelected.username);
    formData.append("password", UserSelected.password);
    formData.append("profile", UserSelected.profile);
    formData.append("role", UserSelected.role);
    // formData.append("deposit", UserSelected.deposit);
    formData.append("user_upd", ReactSession.get("username"));

    formData.append("active", UserSelected.active ? "1" : "0");

    formData.append("METHOD", "PUT");
    try {
      await axios.post(url, formData, {
        params: { idUser: UserSelected.idUser },
      });

      setData((prevData) => {
        return prevData.map((user) =>
          user.idUser === UserSelected.idUser
            ? { ...user, ...UserSelected }
            : user
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
      .post(url, f, { params: { idUser: UserSelected.idUser } })
      .then((response) => {
        setData(data.filter((user) => user.idUser !== UserSelected.idUser));
        openCloseModalDelete();
        clearSelected();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectUser = (user, choix) => {
    setUserSelected(user);

    if (choix === "Edit") {
      openCloseModalEdit();
    } else {
      if (choix === "Delete") {
        openCloseModalDelete();
      } else {
        openCloseModalEditPassword();
      }
    }
  };
  const columns = [
    {
      field: "idUser",
      headerName: "IdUser",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "username",
      headerName: "Nom d'Utilisateur",
      flex: 1,
    },
    {
      field: "password",
      headerName: "Mot de passe",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => <PasswordField value={params.row.password} />,
    },
    {
      field: "profile",
      headerName: "Profile",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "active",
      headerName: "Statut",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.value === 1 ? "Oui" : "Non";
      },
    },
    {
      field: "first_login",
      headerName: " first_login",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.value === 1 ? "Oui" : "Non";
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      renderCell: (params) => {
        return [
          <GridActionsCellItem
            key={`edit-${params.row.idUser}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => selectUser(params.row, "Edit")}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`delete-${params.row.idUser}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => selectUser(params.row, "Delete")}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`delete-${params.row.idUser}`}
            icon={<PasswordIcon />}
            label="Password"
            onClick={() => selectUser(params.row, "Password")}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    requestGet();
    requestGetRole();
    requestGetProfile();
    // requestGetDeposit();
  }, []);
  return (
    <Box m="25px">
      <Header title="Utilisateur" subtitle="Liste des Utilisateurs" />
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={() => openCloseModalInsert()}
        >
          Nouveau Utilisateur
        </Button>
      </Box>

      <Modal isOpen={modalAdd}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Ajouter un Utilisateur{" "}
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
              label="Username"
              // onBlur={handleBlur}
              onChange={HandleChange}
              name="username"
              // error={!!touched.firstName && !!errors.firstName}
              // helperText={touched.firstName && errors.firstName}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Password"
              // onBlur={handleBlur}
              onChange={HandleChange}
              name="password"
              // error={!!touched.firstName && !!errors.firstName}
              // helperText={touched.firstName && errors.firstName}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              // id="outlined-select-currency"
              select
              label="Profile"
              onChange={HandleChange}
              name="profile"
              SelectProps={{
                native: true,
              }}
              sx={{ gridColumn: "span 4" }}
            >
              <option value="" selected disabled>
                Choisissez un Profile
              </option>
              {dataProfile.map((profile) => (
                <option value={profile.profile} key={profile.profile}>
                  {profile.profile}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              // id="outlined-select-currency"
              select
              label="Role"
              onChange={HandleChange}
              name="role"
              SelectProps={{
                native: true,
              }}
              sx={{ gridColumn: "span 4" }}
            >
              <option value="" selected disabled>
                Choisissez un Role
              </option>
              {dataRole.map((role) => (
                <option value={role.role} key={role.role}>
                  {role.role}
                </option>
              ))}
            </TextField>

            {/* <TextField
              fullWidth
              variant="filled"
              // id="outlined-select-currency"
              select
              label="Dépôt"
              onChange={HandleChange}
              name="deposit"
              SelectProps={{
                native: true,
              }}
              // defaultValue={CommandSelected && CommandSelected.idTraj}
              sx={{ gridColumn: "span 8" }}
            >
              <option value="" selected disabled>
                Choisissez un Dépôt
              </option>
              {dataDeposit.map((deposit) => (
                <option value={deposit.deposit} key={deposit.deposit}>
                  {deposit.deposit}
                </option>
              ))}
            </TextField> */}
          </Box>
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button className="btn btn-primary" onClick={() => requestPost()}>
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

      <Modal isOpen={modalEdit}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Modifier un Utilisateur{" "}
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
              label="Username"
              // onBlur={handleBlur}
              onChange={HandleChange}
              name="username"
              value={UserSelected && UserSelected.username}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              fullWidth
              variant="filled"
              // id="outlined-select-currency"
              select
              label="Profile"
              onChange={HandleChange}
              name="profile"
              defaultValue={UserSelected && UserSelected.profile}
              SelectProps={{
                native: true,
              }}
              sx={{ gridColumn: "span 4" }}
            >
              {dataProfile.map((profile) => (
                <option value={profile.profile} key={profile.profile}>
                  {profile.profile}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              // id="outlined-select-currency"
              select
              label="Role"
              onChange={HandleChange}
              name="role"
              defaultValue={UserSelected && UserSelected.role}
              SelectProps={{
                native: true,
              }}
              sx={{ gridColumn: "span 4" }}
            >
              {dataRole.map((role) => (
                <option value={role.role} key={role.role}>
                  {role.role}
                </option>
              ))}
            </TextField>

            {/* <TextField
              fullWidth
              variant="filled"
              // id="outlined-select-currency"
              select
              label="Dépôt"
              onChange={HandleChange}
              name="deposit"
              defaultValue={UserSelected && UserSelected.deposit}
              SelectProps={{
                native: true,
              }}
              // defaultValue={CommandSelected && CommandSelected.idTraj}
              sx={{ gridColumn: "span 4" }}
            >
              {dataDeposit.map((deposit) => (
                <option value={deposit.deposit} key={deposit.deposit}>
                  {deposit.deposit}
                </option>
              ))}
            </TextField> */}

            <FormControlLabel
              control={
                <Checkbox
                  checked={UserSelected.active}
                  onChange={HandleChange}
                  name="active"
                  color="secondary"
                />
              }
              label="Active"
              sx={{ gridColumn: "span 2" }}
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
            onClick={() => openCloseModalEdit()}
          >
            Fermer
          </button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEditPassword}>
        <ModalHeader
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          Modifier le mot de passe
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
              variant="outlined"
              required
              fullWidth
              label="Nouveau Mot de Passe"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={HandleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ gridColumn: "span 8" }}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Confirmer Mot de Passe"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ gridColumn: "span 8" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={UserSelected.first_login}
                  onChange={HandleChange}
                  name="first_login"
                  color="secondary"
                />
              }
              label="Demande de Changement de mot de passe"
              sx={{ gridColumn: "span 8" }}
            />
            {error && (
              <Typography color="error" sx={{ gridColumn: "span 8", mb: 2 }}>
                {error}
              </Typography>
            )}
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
            onClick={() => handleChangePassword()}
          >
            Modifier
          </button>{" "}
          <button
            className=" btn btn-danger"
            onClick={() => openCloseModalEditPassword()}
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
          Are you sure you want to remove{" "}
          {UserSelected && UserSelected.username} ?
        </ModalBody>
        <ModalFooter
          style={
            theme.palette.mode === "dark"
              ? { backgroundColor: colors.primary[500] }
              : { backgroundColor: "#fcfcfc" }
          }
        >
          <button className="btn btn-danger" onClick={() => requestDelete()}>
            Yes
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => openCloseModalDelete()}
          >
            {" "}
            No
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
          // sx={{
          //   "@media print": {
          //     ".MuiDataGrid-main": {
          //       color: "rgba(0, 0, 0, 0.89)",
          //       width: "fit-content",
          //     },
          //   },
          // }}
          rows={data.map((user) => {
            return {
              id: user.idUser,
              idUser: user.idUser,
              username: user.username,
              password: user.password,
              profile: user.profile,
              role: user.role,
              // deposit: user.deposit,
              active: user.active,
              first_login: user.first_login,
            };
          })}
          getRowId={(row) => row.id}
          columns={columns}
          components={{ toolbar: CustomToolbar }}
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
  fileName: "DriversDatabase",
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

export default User;
