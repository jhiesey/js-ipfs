'use strict'

var IPFS = require('ipfs')
var DHT = require('libp2p-kad-dht')

const node = new IPFS({
  repo: String(Math.random() + Date.now()),
  EXPERIMENTAL: {
    dht: true
  },
  preload: {
    enabled: false
  },
  libp2p: {
    modules: {
      dht: DHT
    },
    config: {
      dht: {}
    }
  }
})

node.once('ready', () => console.log('IPFS node is ready'))

function store () {
  var toStore = document.getElementById('source').value

  node.files.add(Buffer.from(toStore), (err, res) => {
    if (err || !res) {
      return console.error('ipfs add error', err, res)
    }

    res.forEach((file) => {
      if (file && file.hash) {
        console.log('successfully stored', file.hash)
        display(file.hash)
      }
    })
  })
}

function display (hash) {
  // buffer: true results in the returned result being a buffer rather than a stream
  node.files.cat(hash, (err, data) => {
    if (err) { return console.error('ipfs cat error', err) }

    document.getElementById('hash').innerText = hash
    document.getElementById('content').innerText = data
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('store').onclick = store
})
