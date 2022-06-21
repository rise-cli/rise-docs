#! /usr/bin/env node
const app = require('./realApp.js')
const projectRoot = process.cwd()
const start = app(projectRoot)
start()
