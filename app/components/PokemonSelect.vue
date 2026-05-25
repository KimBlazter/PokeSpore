<template>
    <USelectMenu
        v-model="model"
        class="w-full h-15"
        placeholder="Sélectionner un Pokémon..."
        :items="options"
        :loading="pending"
        v-model:search-term="searchTerm"
        :ignore-filter="true"
        :ui="{
            itemLeadingAvatarSize: '3xl',
            leadingAvatarSize: '2xl',
            leadingAvatar: '[&>img]:rounded-none',
            itemLeadingAvatar: '[&>img]:rounded-none',
            itemLabel: 'w-full ml-1 mt-3 capitalize',
            itemTrailing: 'mt-3',
            value: 'ml-8 font-semibold capitalize',
        }"
        :search-input="{
            placeholder: 'Rechercher...',
            icon: 'i-lucide-search',
        }"
        :avatar="model?.avatar"
    />
</template>

<script setup lang="ts">
import type { LocalPokemon, Type } from '#shared/types/Pokemon'

export interface PokemonOption {
    label: string
    value: number
    avatar: {
        src: string | undefined
        alt: string
        loading: 'lazy'
    }
    types: Type[]
}

const model = defineModel<PokemonOption | undefined>()

const searchTerm = ref('')

const { data: options, pending } = useFetch('/api/pokemon/all', {
    query: {
        limit: 10,
        startWith: searchTerm,
    },
    watch: [searchTerm],
    transform: (data: LocalPokemon[]) =>
        data.map((pokemon) => ({
            label: pokemon.fr ?? pokemon.name,
            value: pokemon.id,
            avatar: {
                src: pokemon.sprite || undefined,
                alt: pokemon.fr ?? pokemon.name,
                loading: 'lazy' as const,
            },
            types: pokemon.types,
        })),
})
</script>
