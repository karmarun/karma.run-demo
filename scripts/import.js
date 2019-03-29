const fs = require('fs')
const { Remote } = require('@karma.run/sdk')

const { KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  let client = new Remote('http://karma:80/')
  let session = await client.adminLogin(KARMA_INSTANCE_SECRET)
  
  await session.import(fs.readFileSync('./temp/dump.bin.gz'))
}
