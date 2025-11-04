import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0F172A', // navy/blue-gray
      light: '#1E293B',
      dark: '#0A0E1A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3B82F6', // blue (accent)
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC', // soft gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1E293B', // dark slate
      secondary: '#64748B', // gray-600
    },
  },
  typography: {
    fontFamily: "'Inter', 'Poppins', sans-serif",
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#0F172A',
        },
      },
    },
  },
});

export default theme;
