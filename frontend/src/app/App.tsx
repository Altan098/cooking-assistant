import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { router } from './router';

const theme = createTheme({
  palette: {
    primary: { main: '#e67e22' },
    secondary: { main: '#2c3e50' },
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