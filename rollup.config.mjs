import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('rollup').RollupOptions}  */
const options = {
    input: 'src/cli.ts',
    output: [
        {
            dir: 'dist',
            sourcemap: true,
            format: 'esm',
            entryFileNames: `[name].js`,
            chunkFileNames: `[name].js`,
        }
    ],
    plugins: [
        typescript({
            rootDir: "./src",
            declaration: false,
        }),
        commonjs(),
        // terser(),
    ],

}

export default options;