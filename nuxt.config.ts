import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [tailwindcss()],
    },
    modules: ['@nuxt/ui'],
    typescript: {
        nodeTsConfig: {
            compilerOptions: {
                types: ['@types/node'],
            },
            include: ['../scripts/**/*.ts'],
        },
    },
})
