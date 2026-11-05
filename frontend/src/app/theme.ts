import { createTheme } from '@mui/material';

const HEADING_FONT = "'Playfair Display Variable', Georgia, serif";
const BORDER = '#EADFD0';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#B5472E', dark: '#943722', light: '#E9B8A6', contrastText: '#FFFFFF' },
    secondary: { main: '#2F4A3C', dark: '#223729', contrastText: '#FFFFFF' },
    background: { default: '#FBF6EE', paper: '#FFFFFF' },
    text: { primary: '#2B2320', secondary: '#6B5E55' },
    divider: BORDER,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Manrope Variable', system-ui, sans-serif",
    h1: { fontFamily: HEADING_FONT, fontWeight: 700 },
    h2: { fontFamily: HEADING_FONT, fontWeight: 700 },
    h3: { fontFamily: HEADING_FONT, fontWeight: 700 },
    h4: { fontFamily: HEADING_FONT, fontWeight: 700 },
    h5: { fontFamily: HEADING_FONT, fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@media (prefers-reduced-motion: reduce)': {
          '*': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 999, paddingInline: 20 } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { outlined: { borderColor: BORDER } },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderRadius: 20 } },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { backgroundColor: '#FFFFFF' } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 14 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 20 } },
    },
  },
});
