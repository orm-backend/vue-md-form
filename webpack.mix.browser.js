const mix = require('laravel-mix');
require('laravel-mix-polyfill');

mix.copyDirectory('node_modules/vee-validate/dist/locale', 'public/assets/form/locale');

mix
.options({
    extractVueStyles: 'dist/md-form.css',
})
.sourceMaps()
.js('src/main.js', 'dist/md-form.js')
.polyfill({
	enabled: true,
	useBuiltIns: "usage",
	targets: "defaults", // listed below
/*	targets: {
		"android": "81",
		"chrome": "80",
		"edge": "18",
		"firefox": "68",
		"ie": "11",
		"ios": "12.2",
		"opera": "67",
		"safari": "13",
		"samsung": "10.1"
	},*/
	corejs: 3
})
.minify('dist/md-form.js')
