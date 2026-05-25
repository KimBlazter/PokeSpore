import fs from 'node:fs/promises'
import type {
    LocalPokemon,
    Pokemon as PokeApiPokemon,
    Type,
} from '../shared/types/Pokemon'

interface PokeApiPokemonListResponse {
    results: Array<{
        name: string
        url: string
    }>
}

interface PokeApiPokemonSpeciesResponse {
    name: string
    names: Array<{
        language: {
            name: string
        }
        name: string
    }>
    generation: {
        name: string
        url: string
    }
}

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=2000'

async function fetchAllPokemon() {
    console.log('Fetching pokemon list...')

    const response = await fetch(API_URL)
    const data: PokeApiPokemonListResponse = await response.json()

    const pokemons: LocalPokemon[] = []

    for (const pokemon of data.results) {
        console.log(`Fetching ${pokemon.name}...`)

        const pokemonResponse = await fetch(pokemon.url)
        const pokemonData = (await pokemonResponse.json()) as PokeApiPokemon
        const speciesDetails =
            pokemonData.species?.url ?
                await fetchPokemonSpeciesDetails(pokemonData.species.url)
            :   null

        pokemons.push({
            id: pokemonData.id,
            name: pokemonData.name,

            fr: speciesDetails?.fr ?? pokemonData.name,

            types: pokemonData.types.map((t) => t.type.name as Type),

            sprite:
                pokemonData.sprites.other?.['official-artwork']
                    ?.front_default ?? pokemonData.sprites?.front_default,

            cry: pokemonData.cries?.latest ?? null,

            generation: speciesDetails?.generation ?? null,
        })
    }

    // sort pokemons by id just in case
    pokemons.sort((a, b) => a.id - b.id)

    await fs.mkdir('./server/data', { recursive: true })

    await fs.writeFile(
        './server/data/pokemons.json',
        JSON.stringify(pokemons, null, 2),
        'utf-8'
    )

    console.log(`Saved ${pokemons.length} pokemon`)
}

async function fetchPokemonSpeciesDetails(speciesUrl: string): Promise<{
    fr: string | null
    generation: number | null
}> {
    try {
        const response = await fetch(speciesUrl)
        const data = (await response.json()) as PokeApiPokemonSpeciesResponse

        const frenchName = data.names.find(
            (name: { language: { name: string } }) =>
                name.language.name === 'fr'
        )

        return {
            fr: frenchName?.name ?? data.name,
            generation: extractGenerationNumber(data.generation.name),
        }
    } catch {
        return {
            fr: null,
            generation: null,
        }
    }
}

function extractGenerationNumber(generationName: string): number | null {
    const generationMap: Record<string, number> = {
        'generation-i': 1,
        'generation-ii': 2,
        'generation-iii': 3,
        'generation-iv': 4,
        'generation-v': 5,
        'generation-vi': 6,
        'generation-vii': 7,
        'generation-viii': 8,
        'generation-ix': 9,
    }

    return generationMap[generationName] ?? null
}

fetchAllPokemon().catch(console.error)
