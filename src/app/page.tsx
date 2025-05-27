"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Container, Typography, Paper } from "@mui/material"
import PokemonDashboard from "@/components/pokemon-dashboard"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
  },
})

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper
            elevation={0}
            sx={{ p: 4, mb: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}
          >
            <Typography variant="h3" component="h1" gutterBottom align="center">
              🔥 Pokemon Analytics Dashboard
            </Typography>
            <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
              Explore Pokemon data with advanced analytics and type effectiveness insights
            </Typography>
          </Paper>
          <PokemonDashboard />
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
