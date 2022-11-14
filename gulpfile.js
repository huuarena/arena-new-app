const fs = require('fs')

/**
 * Update shopify scopes from .env file into shopify.app.toml file
 */
const updateScopes = async () => {
  try {
    let envFilepath = './.env'
    let shopifyAppTomlFilepath = './shopify.app.toml'

    let envContent = fs.readFileSync(envFilepath, 'utf8')
    let shopifyAppTomlContent = fs.readFileSync(shopifyAppTomlFilepath, 'utf8')

    let envScopes = envContent
      .split('\n')
      .find((item) => item.includes('SCOPES'))
      .replace(/\s/g, '')
      .replace('SCOPES=', '')
    let shopifyAppTomlScopes = shopifyAppTomlContent
      .split('\n')
      .find((item) => item.includes('scopes'))
      .replace(/\s/g, '')
      .replace(/"/g, '')
      .replace('scopes=', '')

    if (envScopes !== shopifyAppTomlScopes) {
      shopifyAppTomlContent = shopifyAppTomlContent.replace(shopifyAppTomlScopes, envScopes)

      fs.writeFile(shopifyAppTomlFilepath, shopifyAppTomlContent, 'utf8', (err, data) => {
        if (err) throw err
      })
    }
  } catch (error) {
    throw error
  }
}

async function defaultTask(cb) {
  updateScopes()

  cb()
}

exports.default = defaultTask
