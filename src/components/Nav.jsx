import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { motion, useTime, useTransform, useSpring } from 'framer-motion';
import '../styles/nav.css';
import marcDLogo from '../assets/Marc-d_Logo.png';

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  // Framer Motion animation setup (same as Home component)
  const time = useTime();
  const rotate = useTransform(time, [0, 3000], [0, 360], {
    clamp: false,
  });
  const rotatingBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r}deg,rgb(222, 3, 3), #ff0000, #be0303d1, #c0c0c0, #a8a8a8, #be0303)`;
  });

  // Add pulsing animation
  const pulse = useSpring(0, { damping: 0, mass: 5, stiffness: 10 });
  const pulsingBg = useTransform(pulse, (r) => {
    return `blur(${r}px)`;
  });

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

  const isHomePage = location.pathname === '/';
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Map /> },
    { path: '/features', label: 'Features', icon: <Apps /> },
    { path: '/our-story', label: 'Our Story', icon: <People /> },
    { path: '/survey', label: 'Survey', icon: <Assessment /> },
    { path: '/contactus', label: 'Contact Us', icon: <Chat /> }
  ].filter(item => !(isHomePage && item.path === '/'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const goToWaitlist = () => {
    // Navigate directly to home page with waitlist hash
    navigate('/#waitlist');
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
        {!isHomePage && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={goToWaitlist}
              className="nav-drawer-join-button"
            >
              <ListItemText primary="Join" />
            </ListItemButton>
          </ListItem>
        )}
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
              {!isHomePage && (
                <Box className="nav-join-button-container" sx={{ position: 'relative' }}>
                  <motion.div
                    className="absolute -inset-[1.5px] rounded-md"
                    style={{
                      position: 'absolute',
                      inset: '-1px',
                      borderRadius: '8px',
                      background: rotatingBg,
                      filter: pulsingBg,
                      zIndex: 0,
                      filter: 'blur(5px)',
                    }}
                  />
                  <Button
                    onClick={goToWaitlist}
                    className="nav-join-button"
                  >
                    Join
                  </Button>
                </Box>
              )}
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