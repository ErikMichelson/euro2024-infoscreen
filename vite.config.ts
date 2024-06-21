import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { hashElement } from 'folder-hash'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'build-hash',
      closeBundle: async () => {
        const buildHashFile = join('dist', 'build-hash.txt')
        const hash = await hashElement('dist')
        writeFile(buildHashFile, hash.hash)
          .then(() => {
            console.info('Build finished:', hash.hash)
          })
          .catch(error => {
            console.error('Error writing build hash:', error)
          })
      }
    }
  ]
})
