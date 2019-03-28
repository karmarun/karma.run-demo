const mig = require('@karma.run/sdk/migration')
const { KARMA_INSTANCE_SECRET } = process.env

main().catch(console.error)

async function main() {
  let clientSource = new t.Remote('http://karma:80/')
  let clientTarget = new t.Remote('http://karma-etl:80/')
  let sourceSession = await clientSource.adminLogin(KARMA_INSTANCE_SECRET)
  let targetSession = await clientTarget.adminLogin(KARMA_INSTANCE_SECRET)

  await mig.migrate(sourceSession, targetSession, migration).catch(console.error)
}

function migration(image, oldTags, newTags) {

  const myNewModelRef = addModel(image, oldTags, newTags, "MyNewModel", {
    "struct": {
      "myString": {
        "string": {}
      },
    }
  })

  migrateModelByTag(image, oldTags, newTags, 'modelA',
    (model) => {
      model.struct.example = {
        "string": {}
      }
      return model
    },
    (record) => {
      record.example = "example text from migration"
      return record
    })

  return image
}