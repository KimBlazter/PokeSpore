import { Type } from '~~/shared/types/Pokemon'

export default defineEventHandler(async (event) => {
    const { types }: { types: string[] } = getQuery(event)

    const pokemons = await $fetch<LocalPokemon[]>('/api/pokemon/all')

    return pokemons.filter((p) =>
        types.every((t) => p.types.includes(t as Type))
    )
})
