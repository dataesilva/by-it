import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import yaml from '@rollup/plugin-yaml'

// BASE_PATH is set by the GitHub Pages workflow (/repo-name/); defaults to /
// for local dev and for hosts that serve from the domain root.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [svelte(), yaml()],
})
