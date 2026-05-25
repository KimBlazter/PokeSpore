<template>
    <div class="flex flex-wrap">
        <UCard
            title="Quiz Types"
            description="Devinez le Pokémon à partir de ses types"
        >
            <template #title>
                Quiz Types
                <!-- <Type type="flying" :show-label="false" class="h-8 w-8" /> -->
            </template>
            <template #description>
                <p>Devinez le Pokémon à partir de ses types</p>
            </template>
            <template #footer>
                <UButton icon="lucide:play" to="/quiz-pokemon-type"
                    >Lancer le quiz</UButton
                >
            </template>
        </UCard>
    </div>
</template>
