// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { GlobalStyles } from '@mui/material'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // Azul Material Padrão
    secondary: { main: '#9c27b0' },
    background: { default: '#f5f5f5' }
  },
  shape: { borderRadius: 8 }
})

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          // Ajustar container do chat para ocupar mais espaço
          '.css-p3mtaw': {
            maxWidth: '100% !important',
            padding: '0 8px !important',
          },
          '.MuiContainer-maxWidthXl': {
            maxWidth: '100% !important',
            paddingLeft: '8px !important',
            paddingRight: '8px !important',
          },
          // Melhorar área de chat
          '.app-container': {
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
          '.app-bar': {
            height: '30px',
            display: 'flex',
            alignItems: 'center',
          },
          '.chat-cnt': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
          '.chat-msgs': {
            height: '500px',
            overflowY: 'auto',
            padding: '16px',
          },
        }}
      />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
