import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

// Prefer a distinct name to avoid colliding with MUI's useTheme hook.
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  // Return null if provider not present; callers should handle absence.
  return context || null;
};

// Backwards-compat export (avoid importing this accidentally without aliasing).
export const useTheme = useThemeContext;

export const CustomThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#3B82F6',
      },
      secondary: {
        main: '#1E293B',
      },
      background: {
        default: isDarkMode ? '#0F172A' : '#F8FAFC',
        paper: isDarkMode ? '#1E293B' : '#FFFFFF',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: isDarkMode 
                ? '1px solid #334155' 
                : '1px solid #f1f5f9',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: isDarkMode ? '#1E293B' : '#f8fafc',
              borderBottom: isDarkMode 
                ? '2px solid #334155' 
                : '2px solid #e2e8f0',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
