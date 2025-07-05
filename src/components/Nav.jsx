import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  useTheme, 
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  LocalShipping, 
  Map, 
  Chat, 
  Assessment,
  Menu,
  People,
  Apps
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import '../styles/nav.css';
import marcDLogo from '../assets/Marc-d_Logo.png';

function Nav() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Map /> },
    { path: '/features', label: 'Features', icon: <Apps /> },
    { path: '/our-story', label: 'Our Story', icon: <People /> },
    { path: '/survey', label: 'Survey', icon: <Assessment /> },
    { path: '/contactus', label: 'Contact Us', icon: <Chat /> }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} className="nav-drawer-content">
      <Box className="nav-drawer-logo-container">
        <img src={marcDLogo} alt="Marc'd Logo" className="nav-drawer-logo" />
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={isActive(item.path)}
              className="nav-drawer-item"
            >
              <ListItemIcon className="nav-drawer-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky"
        elevation={0}
        className={`nav-appbar ${scrolled ? 'nav-shrink' : ''}`}
      >
        <Toolbar className="nav-toolbar">
          <Box
            component={Link}
            to="/"
            className="nav-logo-container"
          >
            <img 
              src="https://i.postimg.cc/rshTR7Qf/Marc-d-Logo.png" 
              alt="Marc'd Logo" 
              className="nav-logo"
            />
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              className="nav-mobile-toggle"
            >
              <Menu />
            </IconButton>
          ) : (
            <Box className="nav-buttons-container">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  className={`nav-button ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className="nav-drawer-mui-container"
        PaperProps={{
          className: 'nav-drawer'
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Nav;