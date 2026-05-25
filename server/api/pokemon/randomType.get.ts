import pokemons from '#server/data/pokemons.json'

export default defineEventHandler(async (event) => {
    const twoTypes = pokemons.filter((p) => p.types.length === 2)
    const grouped = Object.groupBy(twoTypes, (p) => p.types.sort().join('-'))
    const index = Math.floor(Math.random() * Object.keys(grouped).length)
    const randomGroup = Object.keys(grouped)[index]
    return randomGroup!.split('-')
})
