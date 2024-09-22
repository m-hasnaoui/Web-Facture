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

const Fournisseur = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = config.apiUrl + "fournisseur.php";
  const urlSelect = config.apiUrl + "selection.php";
  const urlProfile = config.apiUrl + "profile.php";
  const urlBasicdata = config.apiUrl + "basic_data.php";
  const urlTransportur = config.apiUrl + "bptnum.php";
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
  const [modalInfo, setModalInfo] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [DateStart, setDateStart] = useState(dayjs().add(-7, "day"));
  const [DateEnd, setDateEnd] = useState(dayjs());
  const [DataSUM, setDataSUM] = useState({ total_sum: 0 });
  const [showTotal, setShowTotal] = useState(false);

  const [selectedFournisseur, setSelectedFournisseur] = useState({
    Code: "",
    BPSNUM: "",
    ABCCLS: "",
    ACCCOD: "",
    BPAADD: "",
    BPAINV: "",
    BPAPAY: "",
    BPRPAY: "",
    BPSGRU: "",
    BPSINV: "",
    BPSNAM: "",
    BPSREM: "",
    BPSRSK: "",
    BPSSHO: "",
    BPSTYP: "",
    BPTNUM: "",
    BSGCOD: "",
    CHGTYP: "",
    CNTNAM: "",
    CUR: "",
    EECICT: "",
    ENAFLG: false,
    IDTSGL: "",
    MDL: false,
    OSTAUZAMT: false,
    OSTCTL: "",
    MNAUTO: 0,
    PAYBAN: "",
    PAYLOKFLG: "",
    PTE: "",
    TSSCOD1: "",
    TSSCOD2: "",
    TSSCOD3: "",
    VACBPR: "",
    user_cre: "",
    user_upd: "",
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedFournisseur((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    console.log(selectedFournisseur);
  };

  const clearSelected = () => {
    setSelectedFournisseur({
      Code: "",
      BPSNUM: "",
      ABCCLS: "",
      ABCCLS: "",
      ACCCOD: "",
      BPAADD: "",
      BPAINV: "",
      BPAPAY: "",
      BPRPAY: "",
      BPSGRU: "",
      BPSINV: "",
      BPSNAM: "",
      BPSREM: "",
      BPSRSK: "",
      BPSSHO: "",
      BPSTYP: "",
      BPTNUM: "",
      BSGCOD: "",
      CHGTYP: "",
      CNTNAM: "",
      CUR: "",
      EECICT: "",
      ENAFLG: false,
      IDTSGL: "",
      MDL: false,
      OSTAUZAMT: false,
      OSTCTL: "",
      MNAUTO: "",
      PAYBAN: "",
      PAYLOKFLG: "",
      PTE: "",
      TSSCOD1: "",
      TSSCOD2: "",
      TSSCOD3: "",
      VACBPR: "",
      user_cre: "",
      user_upd: "",
      username: "",
    });
  };
  const [abcclsOptions, setAbcclsOptions] = useState([]);
  const [bpstypOptions, setBpstypOptions] = useState([]);
  const [bptnumOptions, setBptnumOptions] = useState([]);
  const [bsgcodOptions, setBsgcodOptions] = useState([]);
  const [chgtypOptions, setChgtypOptions] = useState([]);
  const [curOptions, setCurOptions] = useState([]);
  const [ostctlOptions, setOstctlOptions] = useState([]);
  const [paylokflgOptions, setPaylokflgOptions] = useState([]);
  const [tsscod1Options, setTsscod1Options] = useState([]);
  const [tsscod2Options, setTsscod2Options] = useState([]);
  const [tsscod3Options, setTsscod3Options] = useState([]);
  const [vacbprOptions, setVacbprOptions] = useState([]);
  const [pteOptions, setPteOptions] = useState([]);

  const fetchSelectOptions = async () => {
    try {
      const abccls = await axios.get(urlBasicdata + "?abccls");
      setAbcclsOptions(abccls.data);

      const bpstyp = await axios.get(urlBasicdata + "?bpstyp");
      setBpstypOptions(bpstyp.data);

      const bptnum = await axios.get(urlTransportur + "?bptnum");
      setBptnumOptions(bptnum.data);

      const chgtyp = await axios.get(urlBasicdata + "?chgtyp");
      setChgtypOptions(chgtyp.data);

      const cur = await axios.get(urlBasicdata + "?cur");
      setCurOptions(cur.data);

      const ostctl = await axios.get(urlBasicdata + "?ostctl");
      setOstctlOptions(ostctl.data);
      const paylokflg = await axios.get(urlBasicdata + "?paylokflg");
      setPaylokflgOptions(paylokflg.data);
      const tsscod1 = await axios.get(urlBasicdata + "?tsscod1");
      setTsscod1Options(tsscod1.data);
      const tsscod2 = await axios.get(urlBasicdata + "?tsscod2");
      setTsscod2Options(tsscod2.data);
      const tsscod3 = await axios.get(urlBasicdata + "?tsscod3");
      setTsscod3Options(tsscod3.data);
      const vacbpr = await axios.get(urlBasicdata + "?vacbpr");
      setVacbprOptions(vacbpr.data);
      const pte = await axios.get(urlBasicdata + "?pte");
      setPteOptions(pte.data);
    } catch (error) {
      console.error("Error fetching select options:", error);
    }
  };

  const toggleShowTotal = () => {
    setShowTotal((prevShowTotal) => !prevShowTotal);
  };

  const openCloseModalInsert = () => {
    fetchSelectOptions();
    clearSelected();
    setModalAdd(!modalAdd);
    setError(false);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };
  const openCloseModalInfo = () => {
    setModalInfo(!modalInfo);
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
          description: "Fournisseur",
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

  const requestPostFournisseur = async () => {
    if (!selectedFournisseur.ABCCLS || !selectedFournisseur.ACCCOD) {
      setError(true);
      return;
    }

    const formData = new FormData();
    // formData.append("BPSNUM", selectedFournisseur.BPSNUM);

    if (selectedFournisseur.ABCCLS)
      formData.append("ABCCLS", selectedFournisseur.ABCCLS);
    formData.append("ACCCOD", selectedFournisseur.ACCCOD || "0");
    formData.append("BPAADD", selectedFournisseur.BPAADD || "0");
    formData.append("BPAINV", selectedFournisseur.BPAINV || "0");
    formData.append("BPAPAY", selectedFournisseur.BPAPAY || "0");
    if (selectedFournisseur.BPRPAY)
      formData.append("BPRPAY", selectedFournisseur.BPRPAY);
    if (selectedFournisseur.BPSGRU)
      formData.append("BPSGRU", selectedFournisseur.BPSGRU);
    if (selectedFournisseur.BPSINV)
      formData.append("BPSINV", selectedFournisseur.BPSINV);
    formData.append("BPSNAM", selectedFournisseur.BPSNAM || "0");
    formData.append("BPSREM", selectedFournisseur.BPSREM || "0");
    if (selectedFournisseur.BPSRSK)
      formData.append("BPSRSK", selectedFournisseur.BPSRSK);
    formData.append("BPSSHO", selectedFournisseur.BPSSHO || "0");
    if (selectedFournisseur.BPSTYP)
      formData.append("BPSTYP", selectedFournisseur.BPSTYP);
    if (selectedFournisseur.BPTNUM)
      formData.append("BPTNUM", selectedFournisseur.BPTNUM);
    if (selectedFournisseur.BSGCOD)
      formData.append("BSGCOD", selectedFournisseur.BSGCOD);
    if (selectedFournisseur.CHGTYP)
      formData.append("CHGTYP", selectedFournisseur.CHGTYP);
    formData.append("CNTNAM", selectedFournisseur.CNTNAM || "0");
    if (selectedFournisseur.CUR)
      formData.append("CUR", selectedFournisseur.CUR);
    formData.append("EECICT", selectedFournisseur.EECICT || "0");
    formData.append("ENAFLG", selectedFournisseur.ENAFLG ? "1" : "0");
    formData.append("IDTSGL", selectedFournisseur.IDTSGL || "0");
    formData.append("MDL", selectedFournisseur.MDL ? "1" : "0");
    formData.append("OSTAUZAMT", selectedFournisseur.OSTAUZAMT ? "1" : "0");
    if (selectedFournisseur.OSTCTL)
      formData.append("OSTCTL", selectedFournisseur.OSTCTL);
    formData.append("MNAUTO", selectedFournisseur.MNAUTO || "0");
    formData.append("PAYBAN", selectedFournisseur.PAYBAN || "0");
    if (selectedFournisseur.PAYLOKFLG)
      formData.append("PAYLOKFLG", selectedFournisseur.PAYLOKFLG);
    if (selectedFournisseur.PTE)
      formData.append("PTE", selectedFournisseur.PTE);
    if (selectedFournisseur.TSSCOD1)
      formData.append("TSSCOD1", selectedFournisseur.TSSCOD1);
    if (selectedFournisseur.TSSCOD2)
      formData.append("TSSCOD2", selectedFournisseur.TSSCOD2);
    if (selectedFournisseur.TSSCOD3)
      formData.append("TSSCOD3", selectedFournisseur.TSSCOD3);
    if (selectedFournisseur.VACBPR)
      formData.append("VACBPR", selectedFournisseur.VACBPR);

    formData.append("user_cre", ReactSession.get("username"));
    formData.append("METHOD", "POST");

    try {
      const response = await axios.post(url, formData);
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

    // formData.append("BPSNUM", selectedFournisseur.BPSNUM);

    if (selectedFournisseur.ABCCLS)
      formData.append("ABCCLS", selectedFournisseur.ABCCLS);
    formData.append("ACCCOD", selectedFournisseur.ACCCOD || "0");
    formData.append("BPAADD", selectedFournisseur.BPAADD || "0");
    formData.append("BPAINV", selectedFournisseur.BPAINV || "0");
    formData.append("BPAPAY", selectedFournisseur.BPAPAY || "0");
    if (selectedFournisseur.BPRPAY)
      formData.append("BPRPAY", selectedFournisseur.BPRPAY);
    if (selectedFournisseur.BPSGRU)
      formData.append("BPSGRU", selectedFournisseur.BPSGRU);
    if (selectedFournisseur.BPSINV)
      formData.append("BPSINV", selectedFournisseur.BPSINV);
    formData.append("BPSNAM", selectedFournisseur.BPSNAM || "0");
    formData.append("BPSREM", selectedFournisseur.BPSREM || "0");
    if (selectedFournisseur.BPSRSK)
      formData.append("BPSRSK", selectedFournisseur.BPSRSK);
    formData.append("BPSSHO", selectedFournisseur.BPSSHO || "0");
    if (selectedFournisseur.BPSTYP)
      formData.append("BPSTYP", selectedFournisseur.BPSTYP);
    if (selectedFournisseur.BPTNUM)
      formData.append("BPTNUM", selectedFournisseur.BPTNUM);
    // if (selectedFournisseur.BSGCOD)
    //   formData.append("BSGCOD", selectedFournisseur.BSGCOD);
    if (selectedFournisseur.CHGTYP)
      formData.append("CHGTYP", selectedFournisseur.CHGTYP);
    formData.append("CNTNAM", selectedFournisseur.CNTNAM || "0");
    if (selectedFournisseur.CUR)
      formData.append("CUR", selectedFournisseur.CUR);
    formData.append("EECICT", selectedFournisseur.EECICT || "0");
    formData.append("ENAFLG", selectedFournisseur.ENAFLG ? "1" : "0");
    formData.append("IDTSGL", selectedFournisseur.IDTSGL || "0");
    formData.append("MDL", selectedFournisseur.MDL ? "1" : "0");
    formData.append("OSTAUZAMT", selectedFournisseur.OSTAUZAMT ? "1" : "0");
    if (selectedFournisseur.OSTCTL)
      formData.append("OSTCTL", selectedFournisseur.OSTCTL);
    formData.append("MNAUTO", selectedFournisseur.MNAUTO || "0");
    formData.append("PAYBAN", selectedFournisseur.PAYBAN || "0");
    if (selectedFournisseur.PAYLOKFLG)
      formData.append("PAYLOKFLG", selectedFournisseur.PAYLOKFLG);
    if (selectedFournisseur.PTE)
      formData.append("PTE", selectedFournisseur.PTE);
    if (selectedFournisseur.TSSCOD1)
      formData.append("TSSCOD1", selectedFournisseur.TSSCOD1);
    if (selectedFournisseur.TSSCOD2)
      formData.append("TSSCOD2", selectedFournisseur.TSSCOD2);
    if (selectedFournisseur.TSSCOD3)
      formData.append("TSSCOD3", selectedFournisseur.TSSCOD3);
    if (selectedFournisseur.VACBPR)
      formData.append("VACBPR", selectedFournisseur.VACBPR);

    formData.append("user_upd", ReactSession.get("username"));
    formData.append("METHOD", "PUT");

    try {
      await axios.post(url, formData, {
        params: { Code: selectedFournisseur.Code },
      });

      setData((prevData) => {
        return prevData.map((Fournisseur) =>
          Fournisseur.Code === selectedFournisseur.Code
            ? { ...Fournisseur, ...selectedFournisseur }
            : Fournisseur
        );
      });

      requestGet();
      openCloseModalEdit();
      clearSelected();
    } catch (error) {
      console.error("Error in requestPut:", error);
      // Optionally, set an error state or show an error message to the user
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
          Code: selectedFournisseur.Code,
          user_del: ReactSession.get("username"),
        },
      });
      setData(
        data.filter(
          (Fournisseur) => Fournisseur.Code !== selectedFournisseur.Code
        )
      );
      openCloseModalDelete();
    } catch (error) {
      console.error(error);
    }
  };

  const selectFournisseur = (Fournisseur, action) => {
    setSelectedFournisseur(Fournisseur);
    // action === "Edit" ? openCloseModalEdit() : openCloseModalDelete();
    if (action === "Edit") {
      openCloseModalEdit();
    } else if (action === "Delete") {
      openCloseModalDelete();
    } else if (action === "Info") {
      openCloseModalInfo();
    }
  };

  const columns = [
    {
      field: "Code",
      headerName: "Code",
      minWidth: 100,
      renderCell: (params) => {
        return [
          // (dataProfile.length > 0 && dataProfile[0].op_edit == 1) ||
          // ReactSession.get("role") == "admin" ? (
          <Tooltip title="Info" arrow>
            <RemoveRedEyeOutlined
              key={`info-${params.row.Code}`}
              icon={<EditIcon />}
              label="Info"
              className="textPrimary"
              onClick={() => selectFournisseur(params.row, "Info")}
              color="inherit"
            />
            ,
          </Tooltip>,
          // ) : null,
        ];
      },
    },
    { field: "BPSNUM", headerName: "Fournisseur Code", minWidth: 150 },
    { field: "ABCCLS", headerName: "Catégorie ABC", minWidth: 150 },
    {
      field: "ACCCOD",
      headerName: "Code comptable",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.ACCCOD;
      },
    },
    {
      field: "BPAADD",
      headerName: "Adresse par défaut",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.BPAADD;
      },
    },
    {
      field: "BPAINV",
      headerName: "Adresse facture",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.BPAINV;
      },
    },
    {
      field: "BPAPAY",
      headerName: "Adresse tiers payé",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.BPAPAY;
      },
    },
    {
      field: "BPRPAY",
      headerName: "Tiers payé",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.BPRPAY;
      },
    },
    {
      field: "BPSGRU",
      headerName: "Fournisseur groupe",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.BPSGRU;
      },
    },
    {
      field: "BPSINV",
      headerName: "Fournisseur facture",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.BPSINV;
      },
    },
    {
      field: "BPSNAM",
      headerName: "Raison sociale",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.BPSNAM;
      },
    },
    {
      field: "BPSREM",
      headerName: "Observations",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.BPSREM;
      },
    },
    {
      field: "BPSRSK",
      headerName: "Tiers risque",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.BPSRSK;
      },
    },
    {
      field: "BPSSHO",
      headerName: "Intitulé court",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.BPSSHO;
      },
    },
    {
      field: "BPSTYP",
      headerName: "Type fournisseur",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.BPSTYP;
      },
    },
    {
      field: "BPTNUM",
      headerName: "Transporteur",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.BPTNUM;
      },
    },
    {
      field: "BSGCOD",
      headerName: "Catégorie",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.BSGCOD;
      },
    },
    {
      field: "CHGTYP",
      headerName: "Type cours",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.CHGTYP;
      },
    },
    {
      field: "CNTNAM",
      headerName: "Contact par defaut",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.CNTNAM;
      },
    },
    {
      field: "CUR",
      headerName: "Devise",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.CUR;
      },
    },
    {
      field: "EECICT",
      headerName: "Incoterm (Ville livraison)",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.EECICT;
      },
    },
    {
      field: "ENAFLG",
      headerName: "Actif",
      minWidth: 100,
      renderCell: (params) => {
        return params.value ? "Yes" : "No";
      },
    },
    {
      field: "IDTSGL",
      headerName: "Identifiant unique",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.IDTSGL;
      },
    },
    {
      field: "MDL",
      headerName: "Mode livraison",
      minWidth: 100,
      renderCell: (params) => {
        return params.value ? "Yes" : "No";
      },
    },
    {
      field: "OSTAUZAMT",
      headerName: "Encours autorisé",
      minWidth: 100,
      renderCell: (params) => {
        return params.value ? "Yes" : "No";
      },
    },
    {
      field: "OSTCTL",
      headerName: "Contrôle encours",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.OSTCTL;
      },
    },
    {
      field: "MNAUTO",
      headerName: "Montant Autorisé",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.MNAUTO;
      },
    },
    {
      field: "PAYBAN",
      headerName: "Banque règlement",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === "0" ? "-" : selectFournisseur.PAYBAN;
      },
    },
    {
      field: "PAYLOKFLG",
      headerName: "Blocage paiement",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.PAYLOKFLG;
      },
    },
    {
      field: "PTE",
      headerName: "Condition paiement",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.PTE;
      },
    },
    {
      field: "TSSCOD1",
      headerName: "Famille statistique 1",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.TSSCOD1;
      },
    },
    {
      field: "TSSCOD2",
      headerName: "Famille statistique 2",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.TSSCOD2;
      },
    },
    {
      field: "TSSCOD3",
      headerName: "Famille statistique 3",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.TSSCOD3;
      },
    },
    {
      field: "VACBPR",
      headerName: "Régime taxe",
      minWidth: 150,
      renderCell: (params) => {
        return params.value === null ? "No" : selectFournisseur.VACBPR;
      },
    },
    { field: "user_cre", headerName: "User Created", minWidth: 150 },
    { field: "user_upd", headerName: "User Updated", minWidth: 150 },
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
                onClick={() => selectFournisseur(params.row, "Edit")}
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
                onClick={() => selectFournisseur(params.row, "Delete")}
                color="inherit"
              />
            </Tooltip>
          ) : null,
        ];
      },
    },
  ];

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         await requestGetProfile(ReactSession.get("idUser"), "Fournisseur");
  //         await requestGet();
  //         await fetchSelectOptions();
  //         setLoading(false);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //         setLoading(false);
  //       }
  //     };
  //     fetchData();
  //   }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(ReactSession.get('idUser'));
        requestGetProfile(ReactSession.get("idUser"), "Fournisseur");
        requestGet();
        requestGetCategore();

        fetchSelectOptions();

        // console.log(dataProfile[0]);
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
        <>
          <Header title="Fournisseurs" subtitle="List des Fournisseur" />
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
                  Nouvelle Fournisseur
                </Button>
              </Box>
            </Box>
          )}

          <Modal isOpen={modalAdd} size="xl" fullscreen="md">
            <ModalHeader
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              Ajouter Fournisseur
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
                  <TabList
                    onChange={handleTabChange}
                    aria-label="fournisseur tabs"
                  >
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
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Fournisseur Code"
                      onChange={handleChange}
                      name="BPSNUM"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="abccls-label">Catégorie ABC</InputLabel>
                      <Select
                        color="secondary"
                        labelId="abccls-label"
                        id="abccls"
                        value={selectedFournisseur.ABCCLS}
                        label="Catégorie ABC"
                        onChange={handleChange}
                        name="ABCCLS"
                      >
                        {abcclsOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Code comptable"
                      onChange={handleChange}
                      name="ACCCOD"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Adresse par défaut"
                      onChange={handleChange}
                      name="BPAADD"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Adresse facture"
                      onChange={handleChange}
                      name="BPAINV"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Adresse tiers payé"
                      onChange={handleChange}
                      name="BPAPAY"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Tiers payé"
                      onChange={handleChange}
                      name="BPRPAY"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Fournisseur groupe"
                      onChange={handleChange}
                      name="BPSGRU"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Fournisseur facture"
                      onChange={handleChange}
                      name="BPSINV"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Raison sociale"
                      onChange={handleChange}
                      name="BPSNAM"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Observations"
                      onChange={handleChange}
                      name="BPSREM"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Tiers risque"
                      onChange={handleChange}
                      name="BPSRSK"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Intitulé court"
                      onChange={handleChange}
                      name="BPSSHO"
                      sx={{ gridColumn: "span 4" }}
                    />
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="BPSTYP"
                      onChange={handleChange}
                      name="BPSTYP"
                      sx={{ gridColumn: "span 8" }}
                    /> */}

                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="bpstyp-label">
                        Type fournisseur
                      </InputLabel>
                      <Select
                        labelId="bpstyp-label"
                        id="bpstyp"
                        value={selectedFournisseur.BPSTYP}
                        label="Type fournisseur"
                        onChange={handleChange}
                        name="BPSTYP"
                      >
                        {bpstypOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="bptnum-label">Transporteur</InputLabel>
                      <Select
                        labelId="bptnum-label"
                        id="bptnum"
                        value={selectedFournisseur.BPTNUM}
                        label="Transporteur"
                        onChange={handleChange}
                        name="BPTNUM"
                      >
                        {bptnumOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.Raison_sociale}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="abccls-label">Catégorie</InputLabel>
                      <Select
                        labelId="bsgcod-label"
                        id="bsgcod"
                        value={selectedFournisseur.BSGCOD}
                        label="Catégorie"
                        onChange={handleChange}
                        name="BSGCOD"
                      >
                        {dataCategore.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}

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
                      name="BSGCOD"
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
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="CHGTYP"
                      onChange={handleChange}
                      name="CHGTYP"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="chgtyp-label">Type cours</InputLabel>
                      <Select
                        labelId="chgtyp-label"
                        id="chgtyp"
                        value={selectedFournisseur.CHGTYP}
                        label="Type cours"
                        onChange={handleChange}
                        name="CHGTYP"
                      >
                        {chgtypOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Contact par defaut"
                      onChange={handleChange}
                      name="CNTNAM"
                      sx={{ gridColumn: "span 4" }}
                    />

                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="CUR"
                      onChange={handleChange}
                      name="CUR"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="cur-label">Devise</InputLabel>
                      <Select
                        labelId="cur-label"
                        id="cur"
                        value={selectedFournisseur.CUR}
                        label="Devise"
                        onChange={handleChange}
                        name="CUR"
                      >
                        {curOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Incoterm (Ville livraison)"
                      onChange={handleChange}
                      name="EECICT"
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
                            checked={selectedFournisseur.ENAFLG}
                            onChange={handleChange}
                            name="ENAFLG"
                          />
                        }
                        label="Actif"
                      />
                      <FormControl
                        component="fieldset"
                        sx={{ gridColumn: "span 4" }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={selectedFournisseur.MDL}
                              onChange={handleChange}
                              name="MDL"
                            />
                          }
                          label="Mode livraison"
                        />
                      </FormControl>
                      <FormControl
                        component="fieldset"
                        sx={{ gridColumn: "span 3" }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={selectedFournisseur.OSTAUZAMT}
                              onChange={handleChange}
                              name="OSTAUZAMT"
                            />
                          }
                          label="Encours autorisé"
                        />
                      </FormControl>
                    </FormControl>
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Identifiant unique"
                      onChange={handleChange}
                      name="IDTSGL"
                      sx={{ gridColumn: "span 4" }}
                    />

                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="OSTCTL"
                      onChange={handleChange}
                      name="OSTCTL"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="ostctl-label">
                        Contrôle encours
                      </InputLabel>
                      <Select
                        labelId="ostctl-label"
                        id="ostctl"
                        value={selectedFournisseur.OSTCTL}
                        label="Contrôle encours"
                        onChange={handleChange}
                        name="OSTCTL"
                      >
                        {ostctlOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Montant Autorisé"
                      onChange={handleChange}
                      name="MNAUTO"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="Banque règlement"
                      onChange={handleChange}
                      name="PAYBAN"
                      sx={{ gridColumn: "span 4" }}
                    />
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="PAYLOKFLG"
                      onChange={handleChange}
                      name="PAYLOKFLG"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="paylokflg-label">
                        Blocage paiement
                      </InputLabel>
                      <Select
                        labelId="paylokflg-label"
                        id="paylokflg"
                        value={selectedFournisseur.PAYLOKFLG}
                        label="Blocage paiement"
                        onChange={handleChange}
                        name="PAYLOKFLG"
                      >
                        {paylokflgOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <FormControl
                      component="fieldset"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="secondary"
                            checked={selectedFournisseur.PAYLOKFLG}
                            onChange={handleChange}
                            name="PAYLOKFLG"
                          />
                        }
                        label="PAYLOKFLG"
                      />
                    </FormControl> */}
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="PTE"
                      onChange={handleChange}
                      name="PTE"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="pte-label">Condition paiement</InputLabel>
                      <Select
                        labelId="pte-label"
                        id="pte"
                        value={selectedFournisseur.PTE}
                        label="Condition paiement"
                        onChange={handleChange}
                        name="PTE"
                      >
                        {pteOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="TSSCOD1"
                      onChange={handleChange}
                      name="TSSCOD1"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod1-label">
                        Famille statistique 1
                      </InputLabel>
                      <Select
                        labelId="tsscod1-label"
                        id="tsscod1"
                        value={selectedFournisseur.TSSCOD1}
                        label="Famille statistique 1"
                        onChange={handleChange}
                        name="TSSCOD1"
                      >
                        {tsscod1Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="TSSCOD2"
                      onChange={handleChange}
                      name="TSSCOD2"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod2-label">
                        Famille statistique 2
                      </InputLabel>
                      <Select
                        labelId="tsscod2-label"
                        id="tsscod2"
                        value={selectedFournisseur.TSSCOD2}
                        label="Famille statistique 2"
                        onChange={handleChange}
                        name="TSSCOD2"
                      >
                        {tsscod2Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="TSSCOD3"
                      onChange={handleChange}
                      name="TSSCOD3"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod3-label">
                        Famille statistique 3
                      </InputLabel>
                      <Select
                        labelId="tsscod3-label"
                        id="tsscod3"
                        value={selectedFournisseur.TSSCOD3}
                        label="Famille statistique 3"
                        onChange={handleChange}
                        name="TSSCOD3"
                      >
                        {tsscod3Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <TextField
                      fullWidth
                      color="secondary"
                      variant="filled"
                      label="VACBPR"
                      onChange={handleChange}
                      name="VACBPR"
                      sx={{ gridColumn: "span 8" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="vacbpr-label">Régime taxe</InputLabel>
                      <Select
                        labelId="vacbpr-label"
                        id="vacbpr"
                        value={selectedFournisseur.VACBPR}
                        label="Régime taxe"
                        onChange={handleChange}
                        name="VACBPR"
                      >
                        {vacbprOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
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
              {error && <Alert severity="error">Missing required fields</Alert>}
              <Button
                variant="contained"
                color="primary"
                onClick={() => requestPostFournisseur()}
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
          <Modal isOpen={modalEdit} size="xl" fullscreen="md">
            <ModalHeader
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              Modifier Fournisseur
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
                  <TabList
                    onChange={handleTabChange}
                    aria-label="fournisseur tabs"
                  >
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
                      label="Fournisseur Code"
                      name="BPSNUM"
                      value={selectedFournisseur.BPSNUM}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="abccls-label">Catégorie ABC</InputLabel>
                      <Select
                        labelId="abccls-label"
                        id="abccls"
                        value={selectedFournisseur.ABCCLS}
                        label="Catégorie ABC"
                        onChange={handleChange}
                        name="ABCCLS"
                      >
                        {abcclsOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Code comptable"
                      name="ACCCOD"
                      value={selectedFournisseur.ACCCOD}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Adresse par défaut"
                      name="BPAADD"
                      value={selectedFournisseur.BPAADD}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Adresse facture"
                      name="BPAINV"
                      value={selectedFournisseur.BPAINV}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Adresse tiers payé"
                      name="BPAPAY"
                      value={selectedFournisseur.BPAPAY}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Tiers payé"
                      name="BPRPAY"
                      value={selectedFournisseur.BPRPAY}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Fournisseur groupe"
                      name="BPSGRU"
                      value={selectedFournisseur.BPSGRU}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(10, minmax(0, 1fr))"
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
                      label="Fournisseur facture"
                      name="BPSINV"
                      value={selectedFournisseur.BPSINV}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Raison sociale"
                      name="BPSNAM"
                      value={selectedFournisseur.BPSNAM}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Observations"
                      name="BPSREM"
                      value={selectedFournisseur.BPSREM}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Tiers risque"
                      name="BPSRSK"
                      value={selectedFournisseur.BPSRSK}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Intitulé court"
                      name="BPSSHO"
                      value={selectedFournisseur.BPSSHO}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span  2" }}
                      color="secondary"
                    >
                      <InputLabel id="bpstyp-label">
                        Type fournisseur
                      </InputLabel>
                      <Select
                        labelId="bpstyp-label"
                        id="bpstyp"
                        value={selectedFournisseur.BPSTYP}
                        label="Type fournisseur"
                        onChange={handleChange}
                        name="BPSTYP"
                      >
                        {bpstypOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span  2" }}
                      color="secondary"
                    >
                      <InputLabel id="bptnum-label">Transporteur</InputLabel>
                      <Select
                        labelId="bptnum-label"
                        id="bptnum"
                        value={selectedFournisseur.BPTNUM}
                        label="Transporteur"
                        onChange={handleChange}
                        name="BPTNUM"
                      >
                        {bptnumOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.Raison_sociale}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span  2" }}
                      color="secondary"
                    >
                      <InputLabel id="bsgcod-label">
                        {selectedFournisseur.BSGCOD}
                      </InputLabel>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span  2" }}
                      color="secondary"
                    >
                      <InputLabel id="chgtyp-label">Type cours</InputLabel>
                      <Select
                        labelId="chgtyp-label"
                        id="chgtyp"
                        value={selectedFournisseur.CHGTYP}
                        label="Type cours"
                        onChange={handleChange}
                        name="CHGTYP"
                      >
                        {chgtypOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Contact par defaut"
                      name="CNTNAM"
                      value={selectedFournisseur.CNTNAM}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    {selectedFournisseur.CUR ? (
                      <FormControl
                        fullWidth
                        sx={{ gridColumn: "span  2" }}
                        color="secondary"
                      >
                        <InputLabel id="cur-label">Devise</InputLabel>
                        <Select
                          labelId="cur-label"
                          id="cur"
                          defaultValue={selectedFournisseur.CUR}
                          label="Devise"
                          onChange={handleChange}
                          name="CUR"
                        >
                          {curOptions.map((option) => (
                            <MenuItem key={option.Code} value={option.Code}>
                              {option.description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : null}

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Incoterm (Ville livraison)"
                      name="EECICT"
                      value={selectedFournisseur.EECICT}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFournisseur.ENAFLG === "1"}
                          onChange={handleChange}
                          name="ENAFLG"
                          color="secondary"
                        />
                      }
                      label="ENAFLG"
                      sx={{ gridColumn: "span 4" }}
                    /> */}

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Identifiant unique"
                      name="IDTSGL"
                      value={selectedFournisseur.IDTSGL}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFournisseur.OSTAUZAMT === "1"}
                          onChange={handleChange}
                          name="OSTAUZAMT"
                          color="secondary"
                        />
                      }
                      label="OSTAUZAMT"
                      sx={{ gridColumn: "span 4" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="ostctl-label">
                        Contrôle encours
                      </InputLabel>
                      <Select
                        labelId="ostctl-label"
                        id="ostctl"
                        value={selectedFournisseur.OSTCTL}
                        label="Contrôle encours"
                        onChange={handleChange}
                        name="OSTCTL"
                      >
                        {ostctlOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Montant Autorisé"
                      name="MNAUTO"
                      value={selectedFournisseur.MNAUTO}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFournisseur.ENAFLG}
                          onChange={handleChange}
                          name="ENAFLG"
                          color="secondary"
                        />
                      }
                      label="Actif"
                      sx={{ gridColumn: "span 3" }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFournisseur.MDL}
                          onChange={handleChange}
                          name="MDL"
                          color="secondary"
                        />
                      }
                      label="Mode livraison"
                      sx={{ gridColumn: "span 3" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFournisseur.OSTAUZAMT}
                          onChange={handleChange}
                          name="OSTAUZAMT"
                          color="secondary"
                        />
                      }
                      label="Encours autorisé"
                      sx={{ gridColumn: "span 3" }}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Banque règlement"
                      name="PAYBAN"
                      value={selectedFournisseur.PAYBAN}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="paylokflg-label">
                        Blocage paiement
                      </InputLabel>
                      <Select
                        labelId="paylokflg-label"
                        id="paylokflg"
                        value={selectedFournisseur.PAYLOKFLG}
                        label="Blocage paiement"
                        onChange={handleChange}
                        name="PAYLOKFLG"
                      >
                        {paylokflgOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="pte-label">Condition paiement</InputLabel>
                      <Select
                        labelId="pte-label"
                        id="pte"
                        value={selectedFournisseur.PTE}
                        label="Condition paiement"
                        onChange={handleChange}
                        name="PTE"
                      >
                        {pteOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod1-label">
                        Famille statistique 1
                      </InputLabel>
                      <Select
                        labelId="tsscod1-label"
                        id="tsscod1"
                        value={selectedFournisseur.TSSCOD1}
                        label="Famille statistique 1"
                        onChange={handleChange}
                        name="TSSCOD1"
                      >
                        {tsscod1Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod2-label">
                        Famille statistique 2
                      </InputLabel>
                      <Select
                        labelId="tsscod2-label"
                        id="tsscod2"
                        value={selectedFournisseur.TSSCOD2}
                        label="Famille statistique 2"
                        onChange={handleChange}
                        name="TSSCOD2"
                      >
                        {tsscod2Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod3-label">
                        Famille statistique 3
                      </InputLabel>
                      <Select
                        labelId="tsscod3-label"
                        id="tsscod3"
                        value={selectedFournisseur.TSSCOD3}
                        label="Famille statistique 3"
                        onChange={handleChange}
                        name="TSSCOD3"
                      >
                        {tsscod3Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="vacbpr-label">Régime taxe</InputLabel>
                      <Select
                        labelId="vacbpr-label"
                        id="vacbpr"
                        value={selectedFournisseur.VACBPR}
                        label="Régime taxe"
                        onChange={handleChange}
                        name="VACBPR"
                      >
                        {tsscod3Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
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
          <Modal isOpen={modalInfo} size="xl" fullscreen="md">
            <ModalHeader
              style={
                theme.palette.mode === "dark"
                  ? { backgroundColor: colors.primary[500] }
                  : { backgroundColor: "#fcfcfc" }
              }
            >
              Fournisseur
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
                  <TabList
                    onChange={handleTabChange}
                    aria-label="fournisseur tabs"
                  >
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
                      disabled
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Fournisseur Code"
                      name="BPSNUM"
                      value={selectedFournisseur.BPSNUM}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="abccls-label">Catégorie ABC</InputLabel>
                      <Select
                        disabled
                        labelId="abccls-label"
                        id="abccls"
                        value={selectedFournisseur.ABCCLS}
                        label="Catégorie ABC"
                        onChange={handleChange}
                        name="ABCCLS"
                      >
                        {abcclsOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Code comptable"
                      name="ACCCOD"
                      value={selectedFournisseur.ACCCOD}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Adresse par défaut"
                      name="BPAADD"
                      value={selectedFournisseur.BPAADD}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Adresse facture"
                      name="BPAINV"
                      value={selectedFournisseur.BPAINV}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Adresse tiers payé"
                      name="BPAPAY"
                      value={selectedFournisseur.BPAPAY}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Tiers payé"
                      name="BPRPAY"
                      value={selectedFournisseur.BPRPAY}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Fournisseur groupe"
                      name="BPSGRU"
                      value={selectedFournisseur.BPSGRU}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(10, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Fournisseur facture"
                      name="BPSINV"
                      value={selectedFournisseur.BPSINV}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Raison sociale"
                      name="BPSNAM"
                      value={selectedFournisseur.BPSNAM}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Observations"
                      name="BPSREM"
                      value={selectedFournisseur.BPSREM}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Tiers risque"
                      name="BPSRSK"
                      value={selectedFournisseur.BPSRSK}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Intitulé court"
                      name="BPSSHO"
                      value={selectedFournisseur.BPSSHO}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span  2" }}
                      color="secondary"
                    >
                      <InputLabel id="bpstyp-label">
                        Type fournisseur
                      </InputLabel>
                      <Select
                        disabled
                        labelId="bpstyp-label"
                        id="bpstyp"
                        value={selectedFournisseur.BPSTYP}
                        label="Type fournisseur"
                        onChange={handleChange}
                        name="BPSTYP"
                      >
                        {bpstypOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span  2" }}
                      color="secondary"
                    >
                      <InputLabel id="bptnum-label">Transporteur</InputLabel>
                      <Select
                        disabled
                        labelId="bptnum-label"
                        id="bptnum"
                        value={selectedFournisseur.BPTNUM}
                        label="Transporteur"
                        onChange={handleChange}
                        name="BPTNUM"
                      >
                        {bptnumOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.Raison_sociale}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span  2" }}
                      color="secondary"
                    >
                      <InputLabel id="bsgcod-label">
                        {selectedFournisseur.BSGCOD}
                      </InputLabel>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span  2" }}
                      color="secondary"
                    >
                      <InputLabel id="chgtyp-label">Type cours</InputLabel>
                      <Select
                        disabled
                        labelId="chgtyp-label"
                        id="chgtyp"
                        value={selectedFournisseur.CHGTYP}
                        label="Type cours"
                        onChange={handleChange}
                        name="CHGTYP"
                      >
                        {chgtypOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Contact par defaut"
                      name="CNTNAM"
                      value={selectedFournisseur.CNTNAM}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    {selectedFournisseur.CUR ? (
                      <FormControl
                        fullWidth
                        sx={{ gridColumn: "span  2" }}
                        color="secondary"
                      >
                        <InputLabel id="cur-label">Devise</InputLabel>
                        <Select
                          disabled
                          labelId="cur-label"
                          id="cur"
                          defaultValue={selectedFournisseur.CUR}
                          label="Devise"
                          onChange={handleChange}
                          name="CUR"
                        >
                          {curOptions.map((option) => (
                            <MenuItem key={option.Code} value={option.Code}>
                              {option.description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : null}

                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Incoterm (Ville livraison)"
                      name="EECICT"
                      value={selectedFournisseur.EECICT}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFournisseur.ENAFLG === "1"}
                          onChange={handleChange}
                          name="ENAFLG"
                          color="secondary"
                        />
                      }
                      label="ENAFLG"
                      sx={{ gridColumn: "span 4" }}
                    /> */}

                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Identifiant unique"
                      name="IDTSGL"
                      value={selectedFournisseur.IDTSGL}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFournisseur.OSTAUZAMT === "1"}
                          onChange={handleChange}
                          name="OSTAUZAMT"
                          color="secondary"
                        />
                      }
                      label="OSTAUZAMT"
                      sx={{ gridColumn: "span 4" }}
                    /> */}
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="ostctl-label">
                        Contrôle encours
                      </InputLabel>
                      <Select
                        disabled
                        labelId="ostctl-label"
                        id="ostctl"
                        value={selectedFournisseur.OSTCTL}
                        label="Contrôle encours"
                        onChange={handleChange}
                        name="OSTCTL"
                      >
                        {ostctlOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="number"
                      label="Montant Autorisé"
                      name="MNAUTO"
                      value={selectedFournisseur.MNAUTO}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled
                          checked={selectedFournisseur.ENAFLG}
                          onChange={handleChange}
                          name="ENAFLG"
                          color="secondary"
                        />
                      }
                      label="Actif"
                      sx={{ gridColumn: "span 3" }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled
                          checked={selectedFournisseur.MDL}
                          onChange={handleChange}
                          name="MDL"
                          color="secondary"
                        />
                      }
                      label="Mode livraison"
                      sx={{ gridColumn: "span 3" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled
                          checked={selectedFournisseur.OSTAUZAMT}
                          onChange={handleChange}
                          name="OSTAUZAMT"
                          color="secondary"
                        />
                      }
                      label="Encours autorisé"
                      sx={{ gridColumn: "span 3" }}
                    />

                    <TextField
                      fullWidth
                      disabled
                      variant="filled"
                      type="text"
                      label="Banque règlement"
                      name="PAYBAN"
                      value={selectedFournisseur.PAYBAN}
                      onChange={handleChange}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="paylokflg-label">
                        Blocage paiement
                      </InputLabel>
                      <Select
                        disabled
                        labelId="paylokflg-label"
                        id="paylokflg"
                        value={selectedFournisseur.PAYLOKFLG}
                        label="Blocage paiement"
                        onChange={handleChange}
                        name="PAYLOKFLG"
                      >
                        {paylokflgOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="pte-label">Condition paiement</InputLabel>
                      <Select
                        disabled
                        labelId="pte-label"
                        id="pte"
                        value={selectedFournisseur.PTE}
                        label="Condition paiement"
                        onChange={handleChange}
                        name="PTE"
                      >
                        {pteOptions.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod1-label">
                        Famille statistique 1
                      </InputLabel>
                      <Select
                        disabled
                        labelId="tsscod1-label"
                        id="tsscod1"
                        value={selectedFournisseur.TSSCOD1}
                        label="Famille statistique 1"
                        onChange={handleChange}
                        name="TSSCOD1"
                      >
                        {tsscod1Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod2-label">
                        Famille statistique 2
                      </InputLabel>
                      <Select
                        disabled
                        labelId="tsscod2-label"
                        id="tsscod2"
                        value={selectedFournisseur.TSSCOD2}
                        label="Famille statistique 2"
                        onChange={handleChange}
                        name="TSSCOD2"
                      >
                        {tsscod2Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="tsscod3-label">
                        Famille statistique 3
                      </InputLabel>
                      <Select
                        labelId="tsscod3-label"
                        id="tsscod3"
                        value={selectedFournisseur.TSSCOD3}
                        label="Famille statistique 3"
                        onChange={handleChange}
                        name="TSSCOD3"
                      >
                        {tsscod3Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      color="secondary"
                    >
                      <InputLabel id="vacbpr-label">Régime taxe</InputLabel>
                      <Select
                        disabled
                        labelId="vacbpr-label"
                        id="vacbpr"
                        value={selectedFournisseur.VACBPR}
                        label="Régime taxe"
                        onChange={handleChange}
                        name="VACBPR"
                      >
                        {tsscod3Options.map((option) => (
                          <MenuItem key={option.Code} value={option.Code}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </Select>
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

              <Button
                variant="contained"
                color="secondary"
                onClick={openCloseModalInfo}
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
              Etes-vous sûr que vous voulez supprimer Fournisseur°{" "}
              {selectedFournisseur && selectedFournisseur.BPSNUM} ?
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
              rows={data.map((Fournisseur) => ({
                id: Fournisseur.Code,
                Code: Fournisseur.Code,
                BPSNUM: Fournisseur.BPSNUM,
                ABCCLS: Fournisseur.ABCCLS,
                ACCCOD: Fournisseur.ACCCOD,
                BPAADD: Fournisseur.BPAADD,
                BPAINV: Fournisseur.BPAINV,
                BPAPAY: Fournisseur.BPAPAY,
                BPRPAY: Fournisseur.BPRPAY,
                BPSGRU: Fournisseur.BPSGRU,
                BPSINV: Fournisseur.BPSINV,
                BPSNAM: Fournisseur.BPSNAM,
                BPSREM: Fournisseur.BPSREM,
                BPSRSK: Fournisseur.BPSRSK,
                BPSSHO: Fournisseur.BPSSHO,
                BPSTYP: Fournisseur.BPSTYP,
                BPTNUM: Fournisseur.BPTNUM,
                BSGCOD: Fournisseur.BSGCOD,
                CHGTYP: Fournisseur.CHGTYP,
                CNTNAM: Fournisseur.CNTNAM,
                CUR: Fournisseur.CUR,
                EECICT: Fournisseur.EECICT,
                ENAFLG: Fournisseur.ENAFLG,
                IDTSGL: Fournisseur.IDTSGL,
                MDL: Fournisseur.MDL,
                OSTAUZAMT: Fournisseur.OSTAUZAMT,
                OSTCTL: Fournisseur.OSTCTL,
                MNAUTO: Fournisseur.MNAUTO,
                PAYBAN: Fournisseur.PAYBAN,
                PAYLOKFLG: Fournisseur.PAYLOKFLG,
                PTE: Fournisseur.PTE,
                TSSCOD1: Fournisseur.TSSCOD1,
                TSSCOD2: Fournisseur.TSSCOD2,
                TSSCOD3: Fournisseur.TSSCOD3,
                VACBPR: Fournisseur.VACBPR,
                user_cre: Fournisseur.user_cre,
                user_upd: Fournisseur.user_upd,
              }))}
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

export default Fournisseur;
