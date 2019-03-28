import { ServerConfiguration } from '@karma.run/editor'

export default {
  port: 3000,
  karmaDataURL: 'http://karma:80',
  plugins: [],
  editorContexts: (roles: string[], tagMap: ReadonlyMap<string, any>) =>
    [
      {
        name: 'Default',
        modelGroups: [
          {
            name: 'Admin',
            models: Array.from(tagMap.keys())
          }
        ]
      }
    ],
  viewContexts: (roles: string[]) =>
    [
      {
        model: 'modelB',
        name: 'Test Model B',
        slug: 'model-b',
        displayKeyPaths: [['myString']],
        color: '#4E1965',
        field: {
          fields: [
            ['myPassword', {
              type: "password",
            }],
          ]
        }
      },
    ]
} as ServerConfiguration