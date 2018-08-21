'use strict'

const IPFS = require('ipfs')
var DHT = require('libp2p-kad-dht')

const node = new IPFS({
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

console.log('waiting for ready')
node.on('ready', async () => {
  const version = await node.version()

  console.log('Version:', version.version)

  const filesAdded = await node.files.add({
    path: 'hello.txt',
    content: Buffer.from('once upon a midnight dreary while i pondered weak and weary many a quaint')
  })

  console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)

  const fileBuffer = await node.files.cat(filesAdded[0].hash)

  console.log('Added file contents:', fileBuffer.toString())
})
