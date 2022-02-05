import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import { getUser } from '../util/utils';

const drawerWidth = 240;

export default function SidebarDrawer({ children }) {
  const user = getUser();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', height: 'calc(100vh - 100px)' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
              <Link to="/">
                  <ListItem button >
                      <ListItemIcon>
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Home"} />
                  </ListItem>
              </Link>
          </List>
          <List>
              <Link to="/MyPlaylists">
                  <ListItem button >
                      <ListItemIcon>
                          <LibraryMusicIcon />
                      </ListItemIcon>
                      <ListItemText primary={"My Playlists"} />
                  </ListItem>
              </Link>
          </List>
          <List>
              <Link to="/Songs">
                  <ListItem button >
                      <ListItemIcon>
                          <MusicNoteIcon />
                      </ListItemIcon>
                      <ListItemText primary={"All Songs"} />
                  </ListItem>
              </Link>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={user.firstName + ' ' + user.lastName} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Toolbar />
      <Box style={{ height: 'calc(100vh - 100px)', paddingTop: 100, paddingLeft: 0 }} component="main" sx={{ flexGrow: 1, p: 3 }}>
        {React.Children.map(children, child => (
            React.cloneElement(child)
        ))}
      </Box>
    </Box>
  );
}