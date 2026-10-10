import {defineConfig} from 'astro/config';
import svelte from '@astrojs/svelte';
export default defineConfig({output:'static',site:'https://history.pm4gis.nz',integrations:[svelte()],build:{format:'directory'}});
