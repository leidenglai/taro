const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const _ = require('lodash')

const Util = require('./util')
const CONFIG = require('./config')

const appPath = process.cwd()

function build (args, buildConfig) {
  const { type, watch } = buildConfig
  const configDir = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
  const outputPath = path.join(appPath, configDir.outputRoot || CONFIG.OUTPUT_DIR)
  if (!fs.existsSync(outputPath)) {
    fs.ensureDirSync(outputPath)
  } else {
    if (type !== Util.BUILD_TYPES.H5) {
      Util.emptyDirectory(outputPath)
    }
  }
  switch (type) {
    case Util.BUILD_TYPES.H5:
      buildForH5({ watch })
      break
    case Util.BUILD_TYPES.WEAPP:
      buildForWeapp({ watch })
      break
    case Util.BUILD_TYPES.SWAN:
      buildForSwan({ watch })
      break
    case Util.BUILD_TYPES.ALIPAY:
      buildForAlipay({ watch })
      break
    case Util.BUILD_TYPES.TT:
      buildForTt({ watch })
      break
    case Util.BUILD_TYPES.RN:
      buildForRN({ watch })
      break
    case Util.BUILD_TYPES.UI:
      buildForUILibrary({ watch })
      break
    case Util.BUILD_TYPES.PLUGIN:
      buildForPlugin({
        watch,
        platform: buildConfig.platform
      })
      break
    default:
      console.log(chalk.red('输入类型错误，目前只支持 weapp/h5/rn/swan/alipay/tt 六端类型'))
  }
}

function buildForWeapp ({ watch }) {
  require('./weapp').build({
    watch,
    adapter: Util.BUILD_TYPES.WEAPP
  })
}

function buildForSwan ({ watch }) {
  require('./weapp').build({
    watch,
    adapter: Util.BUILD_TYPES.SWAN
  })
}

function buildForAlipay ({ watch }) {
  require('./weapp').build({
    watch,
    adapter: Util.BUILD_TYPES.ALIPAY
  })
}

function buildForTt ({ watch }) {
  require('./weapp').build({
    watch,
    adapter: Util.BUILD_TYPES.TT
  })
}

function buildForH5 (buildConfig) {
  require('./h5').build(buildConfig)
}

function buildForRN ({ watch }) {
  require('./rn').build({ watch })
}

function buildForUILibrary ({ watch }) {
  require('./ui').build({ watch })
}

function buildForPlugin ({ watch, platform }) {
  const typeMap = {
    [Util.BUILD_TYPES.WEAPP]: '微信',
    [Util.BUILD_TYPES.ALIPAY]: '支付宝'
  }
  if (platform !== Util.BUILD_TYPES.WEAPP && platform !== Util.BUILD_TYPES.ALIPAY) {
    console.log(chalk.red('目前插件编译仅支持 微信/支付宝 小程序！'))
    return
  }
  console.log(chalk.green(`开始编译${typeMap[platform]}小程序插件`))
  require('./plugin').build({ watch, platform })
}

module.exports = build
