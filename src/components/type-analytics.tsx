"use client"

import { useMemo } from "react"
import { Grid, Paper, Typography, Box, Chip } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Pokemon, PokemonType } from "@/types/pokemon"

interface TypeAnalyticsProps {
  pokemon: Pokemon[]
  types: PokemonType[]
}

export default function TypeAnalytics({ pokemon, types }: TypeAnalyticsProps) {
  const typeStats = useMemo(() => {
    const typeCount: Record<string, number> = {}
    const typeCombinations: Record<string, number> = {}

    pokemon.forEach((p) => {
      // Count individual types
      p.types.forEach((type) => {
        typeCount[type] = (typeCount[type] || 0) + 1
      })

      // Count type combinations
      if (p.types.length > 1) {
        const combo = p.types.sort().join("/")
        typeCombinations[combo] = (typeCombinations[combo] || 0) + 1
      }
    })

    const typeData = Object.entries(typeCount)
      .map(([type, count]) => ({ type, count, percentage: (count / pokemon.length) * 100 }))
      .sort((a, b) => b.count - a.count)

    const comboData = Object.entries(typeCombinations)
      .map(([combo, count]) => ({ combo, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return { typeData, comboData }
  }, [pokemon])

  const typeEffectivenessStats = useMemo(() => {
    const stats = types
      .map((type) => {
        const superEffective = type.damage_relations?.double_damage_to?.length || 0
        const notVeryEffective = type.damage_relations?.half_damage_to?.length || 0
        const noEffect = type.damage_relations?.no_damage_to?.length || 0
        const weakTo = type.damage_relations?.double_damage_from?.length || 0
        const resistantTo = type.damage_relations?.half_damage_from?.length || 0
        const immuneTo = type.damage_relations?.no_damage_from?.length || 0

        return {
          type: type.name,
          offensive: superEffective - notVeryEffective - noEffect,
          defensive: resistantTo + immuneTo - weakTo,
          superEffective,
          weakTo,
        }
      })
      .sort((a, b) => b.offensive - a.offensive)

    return stats
  }, [types])

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0", "#ffb347", "#87ceeb"]

  return (
    <Grid container spacing={3}>
      {/* Type Distribution */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Type Distribution
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={typeStats.typeData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} Pokemon (${((value / pokemon.length) * 100).toFixed(1)}%)`,
                  "Count",
                ]}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Type Combinations */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Popular Type Combinations
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={typeStats.comboData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ combo, percentage }) => `${combo} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {typeStats.comboData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Type Effectiveness Rankings */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Type Effectiveness Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                🗡️ Best Offensive Types
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {typeEffectivenessStats.slice(0, 5).map((type, index) => (
                  <Box key={type.type} display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" sx={{ minWidth: 20 }}>
                      #{index + 1}
                    </Typography>
                    <Chip label={type.type} size="small" sx={{ minWidth: 80, textTransform: "capitalize" }} />
                    <Typography variant="body2">Super effective vs {type.superEffective} types</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                🛡️ Most Vulnerable Types
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {typeEffectivenessStats
                  .sort((a, b) => b.weakTo - a.weakTo)
                  .slice(0, 5)
                  .map((type, index) => (
                    <Box key={type.type} display="flex" alignItems="center" gap={2}>
                      <Typography variant="body2" sx={{ minWidth: 20 }}>
                        #{index + 1}
                      </Typography>
                      <Chip
                        label={type.type}
                        size="small"
                        sx={{ minWidth: 80, textTransform: "capitalize" }}
                        color="error"
                      />
                      <Typography variant="body2">Weak to {type.weakTo} types</Typography>
                    </Box>
                  ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Summary Stats */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            📈 Summary Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {pokemon.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Pokemon
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  {types.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Types
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {typeStats.comboData.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type Combinations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {Math.round(pokemon.reduce((sum, p) => sum + p.baseExperience, 0) / pokemon.length)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Base EXP
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}
