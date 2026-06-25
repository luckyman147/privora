#!/usr/bin/env node
// Ensures .next/routes-manifest.json exists before the dev server starts.
// Next.js 15 accepts requests before finishing its first compile, so any hit
// during that window throws ENOENT if .next is missing. This seeds a valid
// empty manifest so those requests get a 404 instead of a crash.

const fs   = require('fs')
const path = require('path')

const nextDir  = path.join(__dirname, '..', '.next')
const manifest = path.join(nextDir, 'routes-manifest.json')

if (!fs.existsSync(manifest)) {
  fs.mkdirSync(nextDir, { recursive: true })
  fs.writeFileSync(manifest, JSON.stringify({
    version: 3,
    pages404: true,
    caseSensitive: false,
    basePath: '',
    redirects: [],
    headers: [],
    dynamicRoutes: [],
    staticRoutes: [],
    dataRoutes: [],
    rewrites: { beforeFiles: [], afterFiles: [], fallback: [] },
  }, null, 2))
  console.log('✓ seeded .next/routes-manifest.json')
}
