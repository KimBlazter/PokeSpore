<template>
    <UApp>
        <UHeader title="PokeSpore">
            <template #title>
                <Logo class="h-6 w-auto" />
            </template>
            <template #right>
                <UColorModeButton />
            </template>
        </UHeader>
        <UMain>
            <NuxtPage />
        </UMain>
        <UFooter>
            <template #left>
                <p class="text-muted text-sm">
                    Copyright © {{ new Date().getFullYear() }}
                </p>
            </template>
        </UFooter>
    </UApp>
</template>
