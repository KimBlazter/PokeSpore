import { LocalPokemon } from '#shared/types/Pokemon'
import pokemons from '#server/data/pokemons.json'
export default defineEventHandler(async (event) => {
    const {
        startWith,
        limit,
    }: { startWith: string | undefined; limit: number | undefined } =
        getQuery(event)

    let pokes = pokemons as LocalPokemon[]

    if (startWith) {
        pokes = pokes.filter(
            (p) =>
                p.name.toLowerCase().startsWith(startWith.toLowerCase()) ||
                p.fr?.toLowerCase().startsWith(startWith.toLowerCase())
        )
    }

    if (limit !== undefined) {
        return pokes.slice(0, limit)
    }
    return pokes
})
