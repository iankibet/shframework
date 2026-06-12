import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
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
                'lodash',
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
