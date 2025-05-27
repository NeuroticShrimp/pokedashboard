export interface Pokemon {
  id: number
  name: string
  types: string[]
  height: number
  weight: number
  baseExperience: number
  sprite: string
}

export interface DamageRelations {
  double_damage_from: NamedAPIResource[]
  double_damage_to: NamedAPIResource[]
  half_damage_from: NamedAPIResource[]
  half_damage_to: NamedAPIResource[]
  no_damage_from: NamedAPIResource[]
  no_damage_to: NamedAPIResource[]
}

export interface NamedAPIResource {
  name: string
  url: string
}

export interface PokemonType {
  id: number
  name: string
  damage_relations: DamageRelations
  pokemon: Array<{
    pokemon: NamedAPIResource
    slot: number
  }>
}
