import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve, {nodeResolve} from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH;
console.log('production: ', production);

if (!production) {
  spawn("npm", ["run", "start"], {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
};

export default [
  {
    input: 'src/view/index.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'dist/viewBundle.js'
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production
        }
      }),
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: 'viewBundle.css' }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte'],
        exportConditions: ['svelte']
      }),
      commonjs({
        include: './node_modules/**',
     }),
      typescript({
        sourceMap: !production,
        inlineSources: !production
      }),

      !production &&
      serve({
        host: "localhost",
        port: 3143,
        contentBase: "./dist",
      }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production &&
      livereload({
        watch: "./dist",
      }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production &&
      terser({
        compress: true,
        mangle: true,
      }),
  ],
  watch: {
    clearScreen: false,
  },
  },
  {
    input: './src/controller/main.ts',
    output: {
        format: 'commonjs',
        file: './dist/controllerBundle.js',
        name: 'controllerBundle.js'
    },
    plugins: [
        commonjs({
          include: './node_modules/**',
       }),
        typescript({
           sourceMap: !production,
          inlineSources: !production
        }),
        nodeResolve(),
      production &&
      terser({
        compress: true,
        mangle: true,
      }),
    ]
  }
];