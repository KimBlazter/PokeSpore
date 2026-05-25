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

interface PokeApiPokemonFormResponse {
    form_name: string
    names: Array<{
        language: {
            name: string
        }
        name: string
    }>
    form_names: Array<{
        language: {
            name: string
        }
        name: string
    }>
    version_group: {
        name: string
        url: string
    }
}

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=2000'
const POKEMON_BATCH_SIZE = 25

async function fetchAllPokemon() {
    console.log('Fetching pokemon list...')

    const response = await fetch(API_URL)
    const data: PokeApiPokemonListResponse = await response.json()

    const pokemons: LocalPokemon[] = []

    for (
        let index = 0;
        index < data.results.length;
        index += POKEMON_BATCH_SIZE
    ) {
        const batch = data.results.slice(index, index + POKEMON_BATCH_SIZE)
        const batchPokemons = await Promise.all(
            batch.map((pokemon) => fetchPokemonEntry(pokemon))
        )

        pokemons.push(...batchPokemons)
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

async function fetchPokemonEntry(pokemon: {
    name: string
    url: string
}): Promise<LocalPokemon> {
    console.log(`Fetching ${pokemon.name}...`)

    const pokemonResponse = await fetch(pokemon.url)
    const pokemonData = (await pokemonResponse.json()) as PokeApiPokemon
    const form = pokemonData.forms[0]
    const isDefaultForm = pokemonData.is_default

    let formDetails: Awaited<
        ReturnType<typeof fetchPokemonFormDetails>
    > | null = null
    let speciesDetails: Awaited<
        ReturnType<typeof fetchPokemonSpeciesDetails>
    > | null = null

    if (isDefaultForm) {
        speciesDetails =
            pokemonData.species?.url ?
                await fetchPokemonSpeciesDetails(pokemonData.species.url)
            :   null
    } else if (form?.url) {
        formDetails = await fetchPokemonFormDetails(form.url)

        if (
            formDetails.fr === null ||
            formDetails.versionGroupGeneration === null
        ) {
            speciesDetails =
                pokemonData.species?.url ?
                    await fetchPokemonSpeciesDetails(pokemonData.species.url)
                :   null
        }
    }

    const displayName =
        formDetails?.name ?? formDetails?.formName ?? pokemonData.name
    const displayNameFr =
        formDetails?.fr ?? speciesDetails?.fr ?? pokemonData.name

    return {
        id: pokemonData.id,
        name: displayName,

        fr: displayNameFr,

        types: pokemonData.types.map((t) => t.type.name as Type),

        sprite:
            pokemonData.sprites.other?.['official-artwork']?.front_default ??
            pokemonData.sprites?.front_default,

        cry: pokemonData.cries?.latest ?? null,

        generation:
            formDetails?.versionGroupGeneration ??
            speciesDetails?.generation ??
            null,
    }
}

async function fetchPokemonFormDetails(formUrl: string): Promise<{
    name: string | null
    fr: string | null
    formName: string | null
    versionGroupGeneration: number | null
}> {
    try {
        const response = await fetch(formUrl)
        const data = (await response.json()) as PokeApiPokemonFormResponse

        return {
            name: getLocalizedName(data.names, 'en') ?? null,
            fr:
                getLocalizedName(data.names, 'fr') ??
                getLocalizedName(data.form_names, 'fr') ??
                null,
            formName:
                getLocalizedName(data.form_names, 'fr') ??
                getLocalizedName(data.form_names, 'en') ??
                data.form_name ??
                null,
            versionGroupGeneration: await fetchVersionGroupGeneration(
                data.version_group.url
            ),
        }
    } catch {
        return {
            name: null,
            fr: null,
            formName: null,
            versionGroupGeneration: null,
        }
    }
}

async function fetchVersionGroupGeneration(
    versionGroupUrl: string
): Promise<number | null> {
    try {
        const response = await fetch(versionGroupUrl)
        const data = (await response.json()) as {
            generation: {
                name: string
                url: string
            }
        }

        return extractGenerationNumber(data.generation.name)
    } catch {
        return null
    }
}

function getLocalizedName(
    names: Array<{
        language: {
            name: string
        }
        name: string
    }>,
    language: string
): string | undefined {
    return names.find((entry) => entry.language.name === language)?.name
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
