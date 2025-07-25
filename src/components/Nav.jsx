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
  ListItemText,
  Tooltip
} from '@mui/material';
import { 
  LocalShipping, 
  Map, 
  Chat, 
  Assessment,
  Menu,
  People,
  Apps,
  Login as LoginIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { motion, useTime, useTransform, useSpring } from 'framer-motion';
import '../styles/nav.css';
import marcDLogo from '../assets/Marc-d_Logo.png';
import { useWaitlist } from '../context/WaitlistContext';

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:800px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoClicked, setLogoClicked] = useState(false);
  const { triggerWaitlist } = useWaitlist();

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

  // Throttled scroll handler with useCallback for better performance
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    // Add buffer zone to prevent rapid state changes
    if (scrollY > 50) {
      setScrolled(true);
    } else if (scrollY < 30) {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

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
    // Close mobile drawer if open
    setMobileOpen(false);
    
    if (location.pathname !== '/') {
      // If not on home page, navigate to home with waitlist parameter
      navigate('/?waitlist=true');
    } else {
      // If already on home, trigger waitlist via context
      triggerWaitlist();
    }
  };

  const handleLogoClick = (e) => {
    if (isHomePage) {
      e.preventDefault();
      return;
    }
    
    // Add click animation
    setLogoClicked(true);
    setTimeout(() => setLogoClicked(false), 200);
    
    // Navigate to home page
    navigate('/');
  };

  const drawer = (
    <>
      {/* Close button for mobile drawer */}
      <IconButton
        onClick={handleDrawerToggle}
        className="nav-drawer-close-button"
      >
        <CloseIcon />
      </IconButton>
      
      {/* Logo container - separate from close button */}
      <Tooltip 
        title={isHomePage ? "" : "Back to home page"} 
        placement="right"
        arrow
        slotProps={{
          popper: {
            className: "nav-logo-tooltip-popper-mobile",
            style: {
              transform: 'translateX(-15px) !important',
            }
          },
          tooltip: {
            className: "nav-logo-tooltip-content-mobile",
            sx: {
              fontSize: '0.75rem !important',
              padding: '4px 8px !important',
              margin: '0 !important',
              position: 'relative !important',
              left: '-10px !important',
            }
          }
        }}
      >
        <Box 
          className={`nav-drawer-logo-container ${isHomePage ? 'disabled' : ''}`}
          onClick={isHomePage ? undefined : handleLogoClick}
          sx={{ 
            cursor: isHomePage ? 'default' : 'pointer',
            opacity: isHomePage ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          <img 
            src={marcDLogo} 
            alt="Marc'd Logo" 
            className={`nav-drawer-logo ${isHomePage ? 'disabled' : ''}`} 
          />
        </Box>
      </Tooltip>
      
      {/* Navigation content */}
    <Box onClick={handleDrawerToggle} className="nav-drawer-content">
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
        {isHomePage && (
          <ListItem disablePadding>
            <ListItemButton 
              component={Link}
              to="/signin"
              className="nav-drawer-item"
            >
              <ListItemIcon className="nav-drawer-icon">
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Log In" />
            </ListItemButton>
          </ListItem>
        )}
        {!isHomePage && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={goToWaitlist}
              className="nav-drawer-join-button"
            >
              <ListItemText primary="Join Waitlist" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
    </>
  );

  return (
    <>
      <AppBar 
        position="sticky"
        elevation={0}
        className={`nav-appbar ${scrolled ? 'nav-shrink' : ''}`}
      >
        <Toolbar className="nav-toolbar">
          <Tooltip 
            title={isHomePage ? "" : "Back to home page"} 
            placement="bottom"
            arrow
            slotProps={{
              popper: {
                className: "nav-logo-tooltip-popper",
                style: {
                  transform: 'translateY(-15px) !important',
                }
              },
              tooltip: {
                className: "nav-logo-tooltip-content",
                sx: {
                  fontSize: '0.75rem !important',
                  padding: '4px 8px !important',
                  margin: '0 !important',
                  position: 'relative !important',
                  top: '-10px !important',
                }
              }
            }}
          >
            <Box
              onClick={handleLogoClick}
              className={`nav-logo-container ${isHomePage ? 'disabled' : ''} ${logoClicked ? 'clicked' : ''}`}
              sx={{ 
                cursor: isHomePage ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
          >
            <img 
              src="https://i.postimg.cc/rshTR7Qf/Marc-d-Logo.png" 
              alt="Marc'd Logo" 
                className={`nav-logo ${isHomePage ? 'disabled' : ''}`}
            />
          </Box>
          </Tooltip>

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
              {isHomePage && (
                <Button
                  component={Link}
                  to="/signin"
                  startIcon={<LoginIcon />}
                  className="nav-button"
                  sx={{ ml: 2 }}
                >
                  Log In
                </Button>
              )}
              {!isHomePage && (
                <Box className="nav-join-button-container" sx={{ position: 'relative' }}>
                  <motion.div
                    className="absolute -inset-[1.5px] rounded-md"
                    style={{
                      position: 'absolute',
                      inset: '-1px',
                      borderRadius: '8px',
                      background: rotatingBg,
                      zIndex: 0,
                      filter: 'blur(5px)',
                    }}
                  />
                  <Button
                    onClick={goToWaitlist}
                    className="nav-join-button"
                  >
                    Join Waitlist
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