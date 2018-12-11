const { Remote } = require('@karma.run/sdk')
const e = require('@karma.run/sdk/expression')
const d = require('@karma.run/sdk/value')

require('dotenv').config()
const { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  const client = new Remote(KARMA_ENDPOINT)
  let session = await client.login('admin', KARMA_INSTANCE_SECRET)

  const result = await session.do(

    e.filterList(
      e.all(e.tag("modelB")),
      (index, value) => {
        return e.equal(
          e.field('myString', value),
          e.data(d.string("red").toDataConstructor())
        )
      }
    )
  )

  console.log(JSON.stringify(result, null, 2))
}