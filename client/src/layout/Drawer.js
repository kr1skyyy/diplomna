import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StarIcon from "@mui/icons-material/Star";
import ExitIcon from "@mui/icons-material/ExitToAppTwoTone";
import { Link } from "react-router-dom";
import { getUser } from "../util/utils";

const drawerWidth = 240;

export default function SidebarDrawer({ children }) {
  const user = getUser();
  const logout = () => document.dispatchEvent(new CustomEvent('logout'));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Link to="/">
            <Typography variant="h6" noWrap component="div">
              DiplomnaMusicApp
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            height: "calc(100vh - 100px)",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={user.firstName + " " + user.lastName} />
            </ListItem>

            <Divider />

            <Link to="/">
              <ListItem button>
                <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItem>
            </Link>
            <Link to="/MyPlaylists">
              <ListItem button>
                <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                  <LibraryMusicIcon />
                </ListItemIcon>
                <ListItemText primary={"My Playlists"} />
              </ListItem>
            </Link>
            <Link to="/Genres">
              <ListItem button>
                <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                  <StackedBarChartIcon />
                </ListItemIcon>
                <ListItemText primary={"Genres"} />
              </ListItem>
            </Link>
            <Link to="/Charts">
              <ListItem button>
                <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary={"Charts"} />
              </ListItem>
            </Link>

            <Divider />
            
            <ListItem button onClick={logout}>
              <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                <ExitIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Toolbar />
      <Box
        style={{
          height: "calc(100vh - 100px)",
          paddingTop: 100,
          paddingLeft: 0,
        }}
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        {React.Children.map(children, (child) => React.cloneElement(child))}
      </Box>
    </Box>
  );
}
