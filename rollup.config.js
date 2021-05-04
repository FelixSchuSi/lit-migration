import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
    input: 'index.ts',
    output: {
        file: 'lit-migration.js'
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
    ]
};