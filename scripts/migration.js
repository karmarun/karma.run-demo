const fs = require('fs')
const { Remote } = require('@karma.run/sdk')
const mig = require('@karma.run/sdk/migration')
const mdl = require('@karma.run/sdk/model')

const { KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  let clientSource = new Remote('http://karma:80/')
  let clientTarget = new Remote('http://karma-etl:80/')
  let sourceSession = await clientSource.adminLogin(KARMA_INSTANCE_SECRET)
  let targetSession = await clientTarget.adminLogin(KARMA_INSTANCE_SECRET)

  await mig.migrate(
    sourceSession,
    targetSession,
    (image, oldTags, newTags) => {

      mig.changeModelByTag(image, oldTags, newTags, 'modelA', (rawModel) => {
        rawModel.struct.example = {
          string: {}
        }
        return rawModel
      }, (rawRecord) => {
        rawRecord.example = "example text from migration"
        return rawRecord
      })

      mig.addModel(image, oldTags, newTags, 'MyNewModel', mdl.struct({
        foo: mdl.string
      }))

      return image
    }
  )

  await sourceSession.import(await targetSession.export())
}
