require('dotenv').config()

const t = require('@karma.run/sdk')
const e = require('@karma.run/sdk/expression')
const m = require('@karma.run/sdk/model')
const v = require('@karma.run/sdk/value')
const u = require('@karma.run/sdk/utility')

const { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  let client = new t.Remote(KARMA_ENDPOINT)
  let session

  session = await client.adminLogin('admin', KARMA_INSTANCE_SECRET)
  await session.resetDatabase()
  session = await client.adminLogin('admin', KARMA_INSTANCE_SECRET)

  const modelA = m.struct({
    valueA: m.string,
  })

  const modelB = m.struct({
    myString: m.string,
    myPassword: m.string,
    myOptionalInt: m.optional(
      m.int16
    ),
    myList: m.list(
      m.struct({
        myString: m.string,
        myInt: m.int16,
      })
    ),
    refToModelA: m.dynamicRef('modelA')
  })

  await session.do(u.createModels({ modelA, modelB }))



  const expressionTest = e.func(
    param => e.switchModelRef(
      param,
      e.bool(true),
      [
        {
          match: e.tag('_role'),
          return: value => e.bool(true)
        },
        {
          match: e.tag('modelA'),
          return: value => e.equal(
            e.field('myString', value),
            e.data(d.string("aaa").toDataConstructor())
          )
        }
      ]
    )
  )

  session.do(
    e.define('ex',
      e.create(
        e.tag('_expression'),
        arg => e.data(expressionTest.toValue().toDataConstructor())
      )
    )

  )
}