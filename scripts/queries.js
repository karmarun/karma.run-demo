const t = require('@karma.run/sdk')
const e = require('@karma.run/sdk/expression')
const m = require('@karma.run/sdk/model')
const v = require('@karma.run/sdk/value')
const u = require('@karma.run/sdk/utility')

const { KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  const client = new t.Remote('http://karma:80')
  const session = await client.login('admin', KARMA_INSTANCE_SECRET)

  const tags = await session.do(
    e.all(e.tag("_tag"))
  )
  console.log(tags)

  // const result = await session.do(
  //   e.filterList(
  //     e.all(e.tag("modelB")),
  //     (index, value) => {
  //       return e.equal(
  //         e.field('myString', value),
  //         e.data(d.string("red").toDataConstructor())
  //       )
  //     }
  //   )
  // )

  // console.log(JSON.stringify(result, null, 2))
}