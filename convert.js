const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const request = require('request')

let contents = {}
let map = {}
let baseDir = 'posts-legacy'
let files = fs.readdirSync(baseDir)

let waiting = files.length

files.forEach(file => {
  let baseName = file.split('.').shift()
  let directory = `${baseDir}/${baseName}`

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  fs.renameSync(`${baseDir}/${file}`, `${directory}/${file}`)
})