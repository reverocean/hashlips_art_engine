const _ = require("lodash");
const {readRules, getLayerConfiguration} = require('./ruleParser')
const path = require("path");
const basePath = process.cwd();
const fs = require('fs')

const RULE_FILE = `../Rules-0714.xlsx`


function processRules(ruleName, layersPath) {
  const rules = readRules(RULE_FILE)
  const rule = _.find(rules, rule => _.eq(rule.type, ruleName))
  if (_.isUndefined(rule)) {
    console.error('The rule name is not exist:', ruleName)
    return
  }
  console.log(rule.type)
  const layerConfiguration = getLayerConfiguration(rule.layers)
  console.log(layerConfiguration)
  _.map(layerConfiguration, layer => layer.name)
    .map(layerName => getLayer(layerName, rule))
    .forEach(layer => {
      const layerFolder = path.join(layersPath, layer.layer)
      _.filter(layer.elements, element => !element.value)
        .forEach(element => {
          const elementImageFile = path.resolve(__dirname, path.join(layerFolder, `${element.element}.png`))
          if (fs.existsSync(elementImageFile)) {
            console.log("delete file: ", elementImageFile)
            fs.unlinkSync(elementImageFile)
          }else {
            console.error("The file dose not exist!!!!", elementImageFile)
          }
        })
    })
}

function getLayer(layerName, rule) {
  return _.find(rule.layers, layer => _.eq(layer.layer, layerName))
}


processRules("Plain mfer", "..\\layers")
