"use client"

import { useMemo } from "react"
import { Paper, Typography, Box, Tooltip, Grid } from "@mui/material"
import type { PokemonType } from "@/types/pokemon"

interface TypeEffectivenessMatrixProps {
  types: PokemonType[]
}

export default function TypeEffectivenessMatrix({ types }: TypeEffectivenessMatrixProps) {
  const effectivenessMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}

    types.forEach((attackingType) => {
      matrix[attackingType.name] = {}

      types.forEach((defendingType) => {
        // Default effectiveness is 1x
        let effectiveness = 1

        // Check if attacking type is super effective (2x)
        if (attackingType.damage_relations?.double_damage_to?.some((type) => type.name === defendingType.name)) {
          effectiveness = 2
        }
        // Check if attacking type is not very effective (0.5x)
        else if (attackingType.damage_relations?.half_damage_to?.some((type) => type.name === defendingType.name)) {
          effectiveness = 0.5
        }
        // Check if attacking type has no effect (0x)
        else if (attackingType.damage_relations?.no_damage_to?.some((type) => type.name === defendingType.name)) {
          effectiveness = 0
        }

        matrix[attackingType.name][defendingType.name] = effectiveness
      })
    })

    return matrix
  }, [types])

  const getEffectivenessColor = (effectiveness: number) => {
    switch (effectiveness) {
      case 2:
        return "#4caf50" // Green for super effective
      case 1:
        return "#9e9e9e" // Gray for normal effectiveness
      case 0.5:
        return "#ff9800" // Orange for not very effective
      case 0:
        return "#f44336" // Red for no effect
      default:
        return "#9e9e9e"
    }
  }

  const getEffectivenessText = (effectiveness: number) => {
    switch (effectiveness) {
      case 2:
        return "2×"
      case 1:
        return "1×"
      case 0.5:
        return "½×"
      case 0:
        return "0×"
      default:
        return "1×"
    }
  }

  const getEffectivenessLabel = (effectiveness: number) => {
    switch (effectiveness) {
      case 2:
        return "Super Effective"
      case 1:
        return "Normal Damage"
      case 0.5:
        return "Not Very Effective"
      case 0:
        return "No Effect"
      default:
        return "Normal Damage"
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            ⚔️ Type Effectiveness Matrix
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Attacking type (rows) vs Defending type (columns)
          </Typography>

          {/* Legend */}
          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#4caf50",
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">2× Super Effective</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#9e9e9e",
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">1× Normal</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#ff9800",
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">½× Not Very Effective</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#f44336",
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">0× No Effect</Typography>
            </Box>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 800 }}>
              {/* Header row */}
              <Box display="flex">
                <Box
                  sx={{
                    width: 100,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                  }}
                >
                  ATK \ DEF
                </Box>
                {types.slice(0, 18).map((type) => (
                  <Box
                    key={type.name}
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      textTransform: "capitalize",
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                    }}
                  >
                    {type.name.slice(0, 3)}
                  </Box>
                ))}
              </Box>

              {/* Matrix rows */}
              {types.slice(0, 18).map((attackingType) => (
                <Box key={attackingType.name} display="flex">
                  <Box
                    sx={{
                      width: 100,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {attackingType.name}
                  </Box>
                  {types.slice(0, 18).map((defendingType) => {
                    const effectiveness = effectivenessMatrix[attackingType.name]?.[defendingType.name] || 1
                    return (
                      <Tooltip
                        key={defendingType.name}
                        title={`${attackingType.name} vs ${defendingType.name}: ${getEffectivenessLabel(effectiveness)}`}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: getEffectivenessColor(effectiveness),
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            "&:hover": {
                              opacity: 0.8,
                            },
                          }}
                        >
                          {getEffectivenessText(effectiveness)}
                        </Box>
                      </Tooltip>
                    )
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}
