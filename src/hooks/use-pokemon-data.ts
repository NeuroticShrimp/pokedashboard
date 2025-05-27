"use client"

import { useQuery } from "@tanstack/react-query"
import type { Pokemon, PokemonType } from "@/types/pokemon"

const POKEMON_COUNT = 151 // First generation

async function fetchPokemon(id: number): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon ${id}`)
  }
  const data = await response.json()

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t: any) => t.type.name),
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience || 0,
    sprite: data.sprites.front_default || "/placeholder.svg?height=96&width=96&query=pokemon",
  }
}

async function fetchPokemonType(typeId: number): Promise<PokemonType> {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${typeId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch type ${typeId}`)
  }
  const data = await response.json()

  return {
    id: data.id,
    name: data.name,
    damage_relations: data.damage_relations,
    pokemon: data.pokemon,
  }
}

async function fetchAllPokemon(): Promise<Pokemon[]> {
  const promises = Array.from({ length: POKEMON_COUNT }, (_, i) => fetchPokemon(i + 1))

  const results = await Promise.allSettled(promises)
  return results
    .filter((result): result is PromiseFulfilledResult<Pokemon> => result.status === "fulfilled")
    .map((result) => result.value)
}

async function fetchAllTypes(): Promise<PokemonType[]> {
  const promises = Array.from({ length: 18 }, (_, i) => fetchPokemonType(i + 1))

  const results = await Promise.allSettled(promises)
  return results
    .filter((result): result is PromiseFulfilledResult<PokemonType> => result.status === "fulfilled")
    .map((result) => result.value)
}

export function usePokemonData() {
  const pokemonQuery = useQuery({
    queryKey: ["pokemon"],
    queryFn: fetchAllPokemon,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const typesQuery = useQuery({
    queryKey: ["types"],
    queryFn: fetchAllTypes,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    pokemon: pokemonQuery.data || [],
    types: typesQuery.data || [],
    isLoading: pokemonQuery.isLoading || typesQuery.isLoading,
    error: pokemonQuery.error || typesQuery.error,
  }
}
