import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwriteBundle: () => {
        try {
          // Ensure the 'public' directory exists
          if (!fs.existsSync('public')) {
            fs.mkdirSync('public');
          }
          execSync('node generate-dependencies.js', { stdio: 'inherit' });
          console.log('Dependencies file generated.');
        } catch (error) {
          console.error('Failed to generate dependencies file:', error);
        }
      },
    },
  },
})
