import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { builtinModules, createRequire } from 'module'
import { resolve } from 'path'
import { defineConfig, type RollupOptions } from 'rollup'
import dts from 'rollup-plugin-dts'
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
  input: [ r('src/index.ts') ],
  output: {
    format: 'esm',
    dir: r('lib'),
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
  input: [ r('src/index.ts') ],
  output: {
    format: 'cjs',
    dir: r('lib'),
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
  input: [ r('src/index.ts') ],
  output: {
    format: 'esm',
    dir: r('lib'),
  },
  external,
  plugins: [ dts() ],
}

const config = defineConfig([])

config.push(esmBuild)

config.push(cjsBuild)

config.push(nodeTypes)

export default config
