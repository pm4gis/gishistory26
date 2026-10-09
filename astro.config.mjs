import {defineConfig} from 'astro/config';
import svelte from '@astrojs/svelte';
export default defineConfig({output:'static',site:'https://gishistory26.pages.dev',integrations:[svelte()],build:{format:'directory'}});
