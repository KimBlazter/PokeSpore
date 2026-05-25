<template>
    <div class="flex flex-col">
        <img
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/small/${typeId}.png`"
            :alt="type"
            class="h-14 w-14 aspect-square"
        />
        <span
            v-if="props.showLabel"
            class="capitalize text-center mt-2 font-semibold"
            >{{ type }}</span
        >
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    type: Type
    showLabel?: boolean
}>()

const typeIdMap: Record<Type, number> = {
    normal: 1,
    fighting: 2,
    flying: 3,
    poison: 4,
    ground: 5,
    rock: 6,
    bug: 7,
    ghost: 8,
    steel: 9,
    fire: 10,
    water: 11,
    grass: 12,
    electric: 13,
    psychic: 14,
    ice: 15,
    dragon: 16,
    dark: 17,
    fairy: 18,
}

const typeId = computed(() => {
    return typeIdMap[props.type] || 0
})
</script>
