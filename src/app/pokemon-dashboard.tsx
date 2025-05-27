"use client"

import type React from "react"

import { useState } from "react"
import { Paper, Typography, Box, Tabs, Tab, CircularProgress } from "@mui/material"
import PokemonTable from "./pokemon-table"
import TypeAnalytics from "./type-analytics"
import TypeEffectivenessMatrix from "./type-effectiveness-matrix"
import { usePokemonData } from "@/hooks/use-pokemon-data"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function PokemonDashboard() {
  const [tabValue, setTabValue] = useState(0)
  const { pokemon, types, isLoading, error } = usePokemonData()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Pokemon data...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error loading Pokemon data. Please try again later.
        </Typography>
      </Paper>
    )
  }

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
            },
          }}
        >
          <Tab label="🔍 Pokemon Explorer" />
          <Tab label="📊 Type Analytics" />
          <Tab label="⚔️ Type Effectiveness" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <PokemonTable pokemon={pokemon} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TypeAnalytics pokemon={pokemon} types={types} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <TypeEffectivenessMatrix types={types} />
      </TabPanel>
    </Box>
  )
}
