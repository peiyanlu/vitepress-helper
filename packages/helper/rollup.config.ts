import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { builtinModules, createRequire } from 'module'
import { resolve } from 'path'
import { defineConfig, type RollupOptions } from 'rollup'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import { fileURLToPath } from 'url'


const req = createRequire(import.meta.url)
const pkg = await req('./package.json')


const ROOT = fileURLToPath(import.meta.url)
const r = (p: string) => resolve(ROOT, '..', p)

const external = [
  ...Object.keys(pkg.dependencies),
  ...builtinModules.flatMap((m) =>
    m.includes('punycode') ? [] : [ m, `node:${ m }` ],
  ),
]

const plugins = [
  commonjs(),
  nodeResolve({ preferBuiltins: false }),
  esbuild(),
  json()
]

const esmBuild: RollupOptions = {
  input: [ r('src/helper.ts'), r('src/watcher.ts') ],
  output: {
    format: 'esm',
    dir: r('dist'),
    entryFileNames: `[name].js`,
    chunkFileNames: 'chunk-[hash].js',
  },
  external,
  plugins,
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning)
  },
}

const cjsBuild: RollupOptions = {
  input: [ r('src/helper.ts') ],
  output: {
    format: 'cjs',
    dir: r('dist'),
    entryFileNames: `[name].cjs`,
    chunkFileNames: 'chunk-[hash].cjs',
  },
  external,
  plugins,
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning)
  },
}

const nodeTypes: RollupOptions = {
  input: r('src/helper.ts'),
  output: {
    format: 'esm',
    file: 'dist/helper.d.ts',
  },
  external,
  plugins: [ dts() ],
}

const config = defineConfig([])

config.push(esmBuild)

config.push(cjsBuild)

config.push(nodeTypes)

export default config
