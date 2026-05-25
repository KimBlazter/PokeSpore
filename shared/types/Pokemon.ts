export interface PokeApiNamedResource {
    name: string
    url: string
}

export interface PokemonAbility {
    ability: PokeApiNamedResource
    is_hidden: boolean
    slot: number
}

export interface PokemonGameIndex {
    game_index: number
    version: PokeApiNamedResource
}

export interface PokemonHeldItemVersionDetail {
    rarity: number
    version: PokeApiNamedResource
}

export interface PokemonHeldItem {
    item: PokeApiNamedResource
    version_details: PokemonHeldItemVersionDetail[]
}

export interface PokemonMoveVersionGroupDetail {
    level_learned_at: number
    move_learn_method: PokeApiNamedResource
    version_group: PokeApiNamedResource
}

export interface PokemonMove {
    move: PokeApiNamedResource
    version_group_details: PokemonMoveVersionGroupDetail[]
}

export interface PokemonStat {
    base_stat: number
    effort: number
    stat: PokeApiNamedResource
}

export interface PokemonType {
    slot: number
    type: PokeApiNamedResource
}

export interface PokemonPastType {
    generation: PokeApiNamedResource
    types: PokemonType[]
}

export interface PokemonSprites {
    back_default: string | null
    back_female: string | null
    back_shiny: string | null
    back_shiny_female: string | null
    front_default: string | null
    front_female: string | null
    front_shiny: string | null
    front_shiny_female: string | null
    other?: {
        home?: {
            front_default: string | null
            front_female: string | null
            front_shiny: string | null
            front_shiny_female: string | null
        }
        'official-artwork'?: {
            front_default: string | null
            front_shiny: string | null
        }
    }
    versions?: Record<string, unknown>
    animated?: Record<string, unknown>
}

export interface PokemonSpecies extends PokeApiNamedResource {}

export interface Pokemon {
    id: number
    name: string
    base_experience: number | null
    height: number
    weight: number
    order: number
    is_default: boolean
    abilities: PokemonAbility[]
    forms: PokeApiNamedResource[]
    game_indices: PokemonGameIndex[]
    held_items: PokemonHeldItem[]
    location_area_encounters: string
    moves: PokemonMove[]
    species: PokemonSpecies
    sprites: PokemonSprites
    cries?: {
        latest: string
        legacy: string | null
    }
    stats: PokemonStat[]
    types: PokemonType[]
    past_types?: PokemonPastType[]
}

export interface LocalPokemon {
    id: number
    name: string
    fr: string | null
    types: Type[]
    sprite: string | null
    cry: string | null
    generation: number | null
}

export type Type =
    | 'normal'
    | 'fire'
    | 'water'
    | 'electric'
    | 'grass'
    | 'ice'
    | 'fighting'
    | 'poison'
    | 'ground'
    | 'flying'
    | 'psychic'
    | 'bug'
    | 'rock'
    | 'ghost'
    | 'dragon'
    | 'dark'
    | 'steel'
    | 'fairy'
