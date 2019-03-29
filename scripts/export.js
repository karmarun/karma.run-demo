const fs = require('fs')
const { Remote } = require('@karma.run/sdk')

const { KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  let clientSource = new Remote('http://karma:80/')
  let clientTarget = new Remote('http://karma-etl:80/')
  let sourceSession = await clientSource.adminLogin(KARMA_INSTANCE_SECRET)
  let targetSession = await clientTarget.adminLogin(KARMA_INSTANCE_SECRET)

  fs.appendFileSync('./temp/dump.bin.gz', await targetSession.export())
}
