import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#22272b',
    },
    primary: {
      main: '#579dff',
    },
    text: {
      primary: '#c7d1db',
      secondary: '#9fadbc',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 12,
  },
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
