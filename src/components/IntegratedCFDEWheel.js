import { useEffect, useRef, useState } from "react";
import  CFDEWheel from "cfde-wheel";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/cfde-wheel.css";

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#fff',
          color: 'rgba(0, 0, 0, 0.87)',
          fontSize: '16px',
          border: '1px solid #eee',
          boxShadow: '5px 10px 40px 0 rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          margin: '5px',
        },
      },
    },
  MuiButton:{
    styleOverrides: {
        root: {
          minWidth: '20px',
          padding: '0px',
        }
      },
    },
  MuiTypography: {
        styleOverrides: {
        root: {
            fontSize: '14px !important',
        }
      },
    },
  },
});

export default function IntegratedCFDEWheel (props)  {
  return (
  <ThemeProvider theme={theme}>
    <CFDEWheel className="cfde-wheel" button={true} new_window={true} />
  </ThemeProvider>);
}