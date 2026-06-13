import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        // don't copy the demo app's public/ assets (favicon, logo.html) into the package
        copyPublicDir: false,
        lib: {
            entry: './src/index.js',
            name: 'ShFramework',
            formats: ['es', 'cjs'],
            fileName: (format) => `shframework.${format}.js`,
            cssFileName: 'shframework'
        },
        rollupOptions: {
            external: [
                'vue',
                'vue-router',
                'pinia',
                'bootstrap',
                '@iankibetsh/sh-core',
                'axios',
                'sweetalert2',
                'luxon',
                'nprogress'
            ],
            output: {
                globals: {
                    vue: 'Vue',
                    pinia: 'Pinia'
                }
            }
        }
    }
})
