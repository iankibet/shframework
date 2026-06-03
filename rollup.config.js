import vue from 'rollup-plugin-vue'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import replace from '@rollup/plugin-replace'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import css from 'rollup-plugin-css-only'
import pkg from './package.json'

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {})
]

const envFiles = [
  `.env.${process.env.NODE_ENV}.local`,
  `.env.${process.env.NODE_ENV}`,
  '.env.local',
  '.env'
]

const envValues = envFiles.reduce((values, file) => {
  const filePath = path.resolve(process.cwd(), file)
  if (!fs.existsSync(filePath)) return values
  return {
    ...values,
    ...dotenv.parse(fs.readFileSync(filePath))
  }
}, {})

const envReplacements = Object.keys(envValues).reduce((values, key) => {
  values[`process.env.${key}`] = JSON.stringify(process.env[key] ?? envValues[key])
  return values
}, {})

export default [
  {
    input: 'src/index.js',
    output: [
      {
        format: 'esm',
        file: 'dist/library.mjs'
      },
      {
        format: 'cjs',
        file: 'dist/library.js'
      }
    ],
    external,
    plugins: [
        css(),
      vue(),
      peerDepsExternal(),
      replace({
        preventAssignment: true,
        values: envReplacements
      })
    ]
  }
]
