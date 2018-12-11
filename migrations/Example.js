require('dotenv').config()
const { addModel, guid, migrateModelByTag, makeMigration } = require('karma-tools')

const {KARMA_INSTANCE_SECRET} = process.env

const migrationConfig = {
  source: {
    endpoint: 'http://localhost:8005/',
    username: 'admin',
    password: KARMA_INSTANCE_SECRET,
  },
  target: {
    endpoint: 'http://localhost:8015/',
    username: 'admin',
    password: KARMA_INSTANCE_SECRET,
  }
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
      console.log(model)
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

makeMigration(migration, migrationConfig, './temp')
  .catch(console.error)