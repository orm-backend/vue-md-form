import commonjs from '@rollup/plugin-commonjs'; // Конвертирование CommonJS модулей в ES6
import vue from 'rollup-plugin-vue'; // Обработка однофайловых компонентов .vue
import css from 'rollup-plugin-css-only';
import resolve from '@rollup/plugin-node-resolve';
import inject from '@rollup/plugin-inject';
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/wrapper.js', // Путь до относительного package.json
  external: [
    'vue',
    'vue-material',
    'vee-validate'
  ],
  output: {
    name: 'MdForm',
    exports: 'named',
    globals: {
      'vue': 'Vue',
      'vue-material': 'VueMaterial',
      'vee-validate': 'VeeValidate'
    }
  },
  plugins: [
    commonjs(),
    resolve(),
    css(),
    vue({
      css: false, // Динамически внедряем CSS в тег <style>
      compileTemplate: true, // Явное преобразование шаблона в рендер-функцию
    }),
    inject({
      vue2Dropzone: 'vue2-dropzone'
    }),
    isProduction && terser()
  ]
};
