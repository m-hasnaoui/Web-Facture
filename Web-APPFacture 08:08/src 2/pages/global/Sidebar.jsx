import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
  ContactPage,
  Dashboard,
  Group,
  ArticleOutlined,
  ApartmentOutlined,
  PersonAddAlt1Outlined,
  EmojiTransportationOutlined,
  GroupAddOutlined,
  LocalShippingOutlined,
  AvTimerOutlined,
  CategoryOutlined,
  RoomPreferencesOutlined,
} from "@mui/icons-material";

import { ReactSession } from "react-client-session";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState();

  useEffect(() => {
    const setHeight = () => {
      const sidebarElement = document.getElementById("mySidebar");
      if (sidebarElement) {
        const fullHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          window.innerHeight
        );
        sidebarElement.style.height = `${fullHeight}px`;
      }
    };

    setHeight();

    const resizeObserver = new ResizeObserver(setHeight);
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    // <div id="mySidebar" style={{ display: "flex" }}>
    <div id="mySidebar" style={{ display: "flex", height: "100%" }}>
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
            flexGrow: 1,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    FactureAPP
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`../../assets/user.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {ReactSession.get("username")}
                  </Typography>

                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    {"Role: "} {ReactSession.get("role")}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              {ReactSession.get("role") === "admin" ? (
                <>
                  <SubMenu
                    title="Configuration"
                    icon={<Dashboard />}
                    style={{ color: colors.grey[100] }}
                  >
                    <Item
                      title="Configuration"
                      to="/configuration"
                      icon={<Dashboard />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Utilisateur"
                      to="/utilisateur"
                      icon={<Group />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Profile"
                      to="/profile"
                      icon={<ContactPage />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  {/* <SubMenu
                    title="Utilisateur"
                    icon={<Group />}
                    style={{ color: colors.grey[100] }}
                  >
                    <Item
                      title="Sub-item 1"
                      to="/utilisateur/sub-item-1"
                      icon={<Group />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
                  {/* <Item
                      title="Sub-item 2"
                      to="/utilisateur/sub-item-2"
                      icon={<Group />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu> */}
                  {/* <SubMenu
                    title="Profile"
                    icon={<ContactPage />}
                    style={{ color: colors.grey[100] }}
                  >
                    <Item
                      title="Sub-item 1"
                      to="/profile/sub-item-1"
                      icon={<ContactPage />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Sub-item 2"
                      to="/profile/sub-item-2"
                      icon={<ContactPage />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu> */}
                </>
              ) : (
                <></>
              )}

              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Societe"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Societe"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Societe"
                  to="/societe"
                  icon={<ApartmentOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Article"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Article"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Article"
                  to="/article"
                  icon={<ArticleOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Transporteur"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Transporteur"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Transporteur"
                  to="/transporteur"
                  icon={<EmojiTransportationOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}

              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Fournisseur"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Fournisseur"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Fournisseur"
                  to="/fournisseur"
                  icon={<GroupAddOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}

              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Client"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Client"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Client"
                  to="/client"
                  icon={<PersonAddAlt1Outlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Camion"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Camion"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Camion"
                  to="/camion"
                  icon={<LocalShippingOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Compteur"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Compteur"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Compteur"
                  to="/compteur"
                  icon={<AvTimerOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Acodnum"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Acodnum"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Acodnum"
                  to="/acodnum"
                  icon={<RoomPreferencesOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
              {(ReactSession.get("visibility") &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Catégorie"
                )[0] &&
                ReactSession.get("visibility").filter(
                  (item) => item.page === "Catégorie"
                )[0].visibility == 1) ||
              ReactSession.get("role") === "admin" ? (
                <Item
                  title="Catégorie"
                  to="/catégorie"
                  icon={<CategoryOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <></>
              )}
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </div>
  );
};

export default Sidebar;
