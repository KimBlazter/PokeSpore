import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [tailwindcss()],
    },
    modules: ['@nuxt/ui', '@vercel/speed-insights'],
    typescript: {
        nodeTsConfig: {
            compilerOptions: {
                types: ['@types/node'],
            },
            include: ['../scripts/**/*.ts'],
        },
    },
    app: {
        head: {
            title: 'PokeSpore',
            meta: [
                {
                    name: 'description',
                    content: 'Quiz Pokémon Français communautaire',
                },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
            ],
            htmlAttrs: {
                lang: 'fr',
            },
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.ico',
                },
            ],
        },
    },
})
