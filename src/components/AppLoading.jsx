// src/components/AppLoading.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import logo from "../assets/Marc-d_Logo.png"; // Adjust path if needed

const AppLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
        gap={3}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="Marc'd Logo"
          sx={{ width: 200, height: "auto", mb: 1 }}
        />

        {/* Spinner */}
        <CircularProgress color="primary" size={60} thickness={5} />

        {/* Custom Message */}
        <Typography variant="h6" color="textSecondary">
          Getting everything ready for you...
        </Typography>
      </Box>
    </motion.div>
  );
};

export default AppLoading;
