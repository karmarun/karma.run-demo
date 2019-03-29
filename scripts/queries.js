const { Remote } = require('@karma.run/sdk')
const xpr = require('@karma.run/sdk/expression')
const mdl = require('@karma.run/sdk/model')
const val = require('@karma.run/sdk/value')
const utl = require('@karma.run/sdk/utility')

const { KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  const client = new Remote('http://karma:80')
  const session = await client.login('admin', KARMA_INSTANCE_SECRET)

  let result = await session.do(
    xpr.all(xpr.tag("_tag"))
  )
  console.log(JSON.stringify(result, null, 2), '\n\n')

  result = await session.do(
    xpr.all(xpr.tag("modelA"))
  )
  console.log(JSON.stringify(result, null, 2), '\n\n')

  result = await session.do(
    xpr.filterList(
      xpr.all(xpr.tag("modelB")),
      (index, value) => {
        return xpr.equal(
          xpr.field('myString', value),
          xpr.data(val.string("red").toDataConstructor())
        )
      }
    )
  )
  console.log(JSON.stringify(result, null, 2), '\n\n')
}