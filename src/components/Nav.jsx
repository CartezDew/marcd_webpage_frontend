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
  Menu
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import '../styles/nav.css';

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
    { path: '/truck-stops', label: 'Truck Stops', icon: <LocalShipping /> },
    { path: '/contactus', label: 'Contact Us', icon: <Chat /> },
    { path: '/survey', label: 'Survey', icon: <Assessment /> }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
        <img src="https://i.postimg.cc/rshTR7Qf/Marc-d-Logo.png" alt="Marc'd Logo" style={{ height: '80px' }} />
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
          sx={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderBottom: '1px solid #ddd'
          }}
        >
          <Toolbar sx={{ px: 3, py: 1 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <img 
                src="https://i.postimg.cc/rshTR7Qf/Marc-d-Logo.png" 
                alt="Marc'd Logo" 
                style={{ height: '95px', padding: '5px' }}
              />
            </Box>

            {isMobile ? (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: '#333' }}
              >
                <Menu />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: '#333',
                      fontWeight: 500,
                      borderRadius: '12px',
                      px: 2.5,
                      py: 1,
                      textTransform: 'none',
                      backgroundColor: isActive(item.path) ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                      boxShadow: isActive(item.path) ? 'inset 0 -3px 0 0 #D32F2F' : 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)'
                      }
                    }}
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
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
          },
        }}
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
