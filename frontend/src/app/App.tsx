import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { router } from './router';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#607d8b' },
    secondary: { main: '#455a64' },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#263238',
      secondary: '#546e7a',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}