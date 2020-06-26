const mix = require('laravel-mix');
//require('laravel-mix-polyfill');

mix
.js('src/hotelcity.js', 'public/hotelcity.js')
.sass('src/scss/md-theme.scss', 'public/assets/md-theme.css')
.sass('src/scss/md-hotelcity.scss', 'public/assets/md-hotelcity.css')
