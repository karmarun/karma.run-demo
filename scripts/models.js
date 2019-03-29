const { Remote } = require('@karma.run/sdk')
const xpr = require('@karma.run/sdk/expression')
const mdl = require('@karma.run/sdk/model')
const val = require('@karma.run/sdk/value')
const utl = require('@karma.run/sdk/utility')

const { KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  let client = new Remote('http://karma:80')
  let session

  session = await client.adminLogin(KARMA_INSTANCE_SECRET)
  await session.resetDatabase()
  session = await client.adminLogin(KARMA_INSTANCE_SECRET)

  const modelA = mdl.struct({
    valueA: mdl.string,
  })

  const modelB = mdl.struct({
    myString: mdl.string,
    myPassword: mdl.string,
    myOptionalInt: mdl.optional(
      mdl.int16
    ),
    myList: mdl.list(
      mdl.struct({
        myString: mdl.string,
        myInt: mdl.int16,
      })
    ),
    refToModelA: mdl.dynamicRef('modelA')
  })

  let result = await session.do(utl.createModelsAndTags({ modelA, modelB }))
  console.log(result)

  let ref = await session.do(
    xpr.create(
      xpr.tag('modelA'),
      arg => xpr.data(val.struct({
        'valueA': val.string('my string'),
      }).toDataConstructor())
    )
  )
  console.log(ref)

  result = await session.do(
    xpr.create(
      xpr.tag('modelB'),
      arg => xpr.data(val.struct({
        'myString': val.string('red'),
        'myPassword': val.string('$2y$12$/zA6CG8XPvgjQMtyLKybNOyTA4oNj3jkkVw.JLh/sHfvLgGsTV8Mu'),
        'myOptionalInt': val.int16(1),
        'refToModelA': val.ref(ref),
        'myList': val.list([
          val.struct({
            myString: val.string('my password'),
            myInt: val.int16(1),
          })
        ]),
      }).toDataConstructor())
    )
  )
  console.log(result)

  await createExpression(session)
}


async function createExpression(session) {

  const expression = xpr.func(
    param => xpr.switchModelRef(
      param,
      xpr.bool(true),
      [
        {
          match: xpr.tag('_role'),
          return: value => xpr.bool(true)
        },
        {
          match: xpr.tag('modelA'),
          return: value => xpr.equal(
            // xpr.field('myString', value), // fix xpr.field
            xpr.data(val.string("aaa").toDataConstructor()),
            xpr.data(val.string("aaa").toDataConstructor()),
          )
        }
      ]
    )
  )

  try {
    await session.do(
      xpr.create(
        xpr.tag('_expression'),
        arg => xpr.data(expression.toValue().toDataConstructor())
      )
    )
  }
  catch (e) {
    consolxpr.log(xpr.responsxpr.data.humanReadableError.human)
  }
}