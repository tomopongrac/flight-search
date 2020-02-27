let mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');
require('laravel-mix-purgecss');

mix.react('resources/js/index.js', 'dist/');
mix.sass('resources/css/app.scss', 'dist/').options({    processCssUrls: false,    postCss: [ tailwindcss('./tailwind.config.js') ]}).purgeCss({    enabled: mix.inProduction(),    folders: ['resources'],    extensions: ['html', 'js', 'php', 'vue'],});
