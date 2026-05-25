<template>
    <UCard
        class="flex flex-col m-8 w-3/4 md:w-2/3 lg:w-1/2 mx-auto"
        title="Trouve un Pokémon qui matche les types ci-dessous"
    >
        <div class="mb-4 flex flex-row justify-center gap-8">
            <Type
                v-for="type in types"
                :key="type"
                :type="type"
                :showLabel="true"
            />
        </div>
        <PokemonSelect v-model="selectedPokemon" @update:open="onSelectOpen" />

        <!-- Buttons -->
        <div class="flex flex-row items-center justify-between mt-4 gap-8">
            <!-- Validate -->
            <UButton
                :disabled="!selectedPokemon || pending"
                color="success"
                @click="validate"
                icon="lucide:check"
            >
                Valider
            </UButton>

            <!-- See Solution -->
            <UButton
                color="neutral"
                variant="soft"
                @click="openSolution"
                icon="lucide:circle-question-mark"
            >
                Voir la solution
            </UButton>
        </div>

        <UModal
            v-model:open="solutionOpen"
            dismissible
            :title="`Solutions (${solutionPokemons?.length || 0})`"
        >
            <template #body>
                <p
                    v-if="solutionPending"
                    class="text-center text-sm text-muted"
                >
                    Chargement de la solution...
                </p>
                <template v-else>
                    <div v-if="solutionPokemons?.length" class="flex flex-col">
                        <UAccordion
                            :items="
                                Object.keys(groupedByGenSolutionPokemons).map(
                                    (k) => ({
                                        label:
                                            k === 'Autre' ? 'Autre' : (
                                                `Génération ${k}`
                                            ),
                                        genId: k,
                                    })
                                )
                            "
                            type="multiple"
                        >
                            <template #content="{ item }">
                                <UCard
                                    v-for="pokemon in groupedByGenSolutionPokemons[
                                        item.genId
                                    ]"
                                    :key="pokemon.id"
                                    class="m-2 gap-4"
                                >
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="relative h-16 w-16 shrink-0"
                                        >
                                            <div
                                                class="absolute inset-0 rounded-full bg-elevated z-0"
                                            ></div>
                                            <img
                                                :src="
                                                    pokemon.sprite ?? undefined
                                                "
                                                :alt="
                                                    pokemon.fr ?? pokemon.name
                                                "
                                                class="relative z-10 h-18 w-18"
                                            />
                                        </div>
                                        <span
                                            class="capitalize font-semibold"
                                            >{{
                                                pokemon.fr ?? pokemon.name
                                            }}</span
                                        >
                                    </div>
                                </UCard>
                            </template>
                        </UAccordion>
                    </div>
                    <p v-else class="text-center text-sm text-muted">
                        Aucune solution trouvée.
                    </p>
                </template>
            </template>
        </UModal>

        <!-- Feedback -->
        <div
            v-if="feedback"
            class="mt-4 w-full rounded-lg border px-4 py-3 text-center text-sm font-medium"
            :class="
                feedback.kind === 'success' ?
                    'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300'
                :   'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
            "
        >
            {{ feedback.message }}
            <p v-if="feedback.detail" class="mt-2 text-xs text-muted">
                {{ feedback.detail }}
            </p>
        </div>
    </UCard>
</template>
<script setup lang="ts">
import type { PokemonOption } from '~/components/PokemonSelect.vue'

const selectedPokemon: Ref<PokemonOption | undefined> = ref()
const solutionOpen = ref(false)

// Fetch random types for the quiz
const {
    data: types,
    pending,
    refresh,
} = useFetch<Type[]>('/api/pokemon/randomType')

// Fetch solution pokemons based on the selected types
const {
    data: solutionPokemons,
    pending: solutionPending,
    refresh: refreshSolution,
} = useFetch<LocalPokemon[]>('/api/pokemon/pokemonByType', {
    query: computed(() => ({
        types: types.value,
    })),
    immediate: false,
})

const groupedByGenSolutionPokemons = computed(() => {
    if (!solutionPokemons.value) return {}
    return Object.groupBy(solutionPokemons.value, (p) =>
        p.generation ? p.generation.toString() : 'Autre'
    )
})

const feedback = ref<{
    kind: 'success' | 'error'
    message: string
    detail?: string
} | null>(null)

async function validate() {
    if (!selectedPokemon.value || !types.value) return
    const pokemonTypes = selectedPokemon.value.types
    const isCorrect = types.value?.reduce(
        (acc, type) => acc && pokemonTypes.includes(type as Type),
        true
    )
    feedback.value =
        isCorrect ?
            { kind: 'success', message: 'Bonne réponse !' }
        :   {
                kind: 'error',
                message: 'Mauvaise réponse.',
                detail: `Le Pokémon ${selectedPokemon.value.label} est de type ${pokemonTypes.join(', ')}.`,
            }

    if (isCorrect) {
        selectedPokemon.value = undefined
        await refresh()
    }
}

function onSelectOpen(isOpen: boolean) {
    if (isOpen) {
        feedback.value = null
    }
}

async function openSolution() {
    solutionOpen.value = true

    await refreshSolution()
}
</script>
