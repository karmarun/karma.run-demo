const t = require('@karma.run/sdk')
const e = require('@karma.run/sdk/expression')
const m = require('@karma.run/sdk/model')
const v = require('@karma.run/sdk/value')
const u = require('@karma.run/sdk/utility')

const { KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  let client = new t.Remote('http://karma:80')
  let session

  session = await client.adminLogin(KARMA_INSTANCE_SECRET)
  await session.resetDatabase()
  session = await client.adminLogin(KARMA_INSTANCE_SECRET)

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

  let result = await session.do(u.createModelsAndTags({ modelA, modelB }))
  console.log(result)

  let ref = await session.do(
    e.create(
      e.tag('modelA'),
      arg => e.data(v.struct({
        'valueA': v.string('my string'),
      }).toDataConstructor())
    )
  )
  console.log(ref)

  result = await session.do(
    e.create(
      e.tag('modelB'),
      arg => e.data(v.struct({
        'myString': v.string('red'),
        'myPassword': v.string('$2y$12$/zA6CG8XPvgjQMtyLKybNOyTA4oNj3jkkVw.JLh/sHfvLgGsTV8Mu'),
        'myOptionalInt': v.int16(1),
        'refToModelA': v.ref(ref),
        'myList': v.list([
          v.struct({
            myString: v.string('my password'),
            myInt: v.int16(1),
          })
        ]),
      }).toDataConstructor())
    )
  )
  console.log(result)

  await createExpression(session)
}


async function createExpression(session) {

  const expression = e.func(
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
            // e.field('myString', value), // fix e.field
            e.data(v.string("aaa").toDataConstructor()),
            e.data(v.string("aaa").toDataConstructor()),
          )
        }
      ]
    )
  )

  try {
    await session.do(
      e.create(
        e.tag('_expression'),
        arg => e.data(expression.toValue().toDataConstructor())
      )
    )
  }
  catch (e) {
    console.log(e.response.data.humanReadableError.human)
  }
}