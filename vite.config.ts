import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://m1chal3k28.github.io/familiadaGame/",
  build: {
    sourcemap: false,
  },
})
