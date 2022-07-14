const xlsx = require('node-xlsx')
const _ = require('lodash')
const {isNotUndefined} = require('./utils')


function readRules(ruleFile) {
  const sheets = xlsx.parse(ruleFile)
  const rowData = rowWithIndex(sheets[0].data)
  return getRules(getTypes(rowData), readLayers(rowData))
}

function rowWithIndex(rows) {
  return _.map(rows, (row, index) => [index, ...row])
}

function layerElements(elements, layerIndex) {
  const nextLayerIndex = _.findIndex(elements, (e) => _.isUndefined(e.element), layerIndex)
  if (nextLayerIndex < 0) {
    return _.slice(elements, layerIndex)
  }
  return _.slice(elements, layerIndex, nextLayerIndex)
}

function allElements(rows) {
  return _.tail(rows)
    .map(row => {
      return {
        originIndex: row[0],
        element: row[3]
      }
    })
}

function readLayers(rowData) {
  const elements = allElements(rowData)
  return _.tail(rowData)
    .filter(row => isNotUndefined(row[1]) && isNotUndefined(row[2]))
    .map((row, index) => {
      return {
        originIndex: row[0],
        layer: row[1],
        order: row[2],
        elements: layerElements(elements, row[0])
      }
    })
}

function getTypeElements(rowData, index) {
  return _.tail(rowData)
    .filter(row => isNotUndefined(row[4]))
    .map(row => {
      return {
        originIndex: row[0],
        value: row[index]
      }
    })
}

function getTypes(rowData) {
  return _.head(rowData)
    .slice(4)
    .map((type, index) => {
      return {
        type,
        elements: getTypeElements(rowData, index + 4)
      }
    })
}

function getElementsMap(elements) {
  return _.reduce(elements, (result, element) => {
    const newMap = {...result}
    _.set(newMap, `${element.originIndex}`, element.value)
    return newMap
  }, {})
}

function getLayerWithElementValues(type, layers) {
  const elementsMap = getElementsMap(type.elements)
  return _.map(layers, currentLayer => {
    const {originIndex, layer, order} = currentLayer
    return {
      originIndex,
      layer,
      order,
      elements: _.map(currentLayer.elements, element => {
        return {
          ...element,
          value: _.get(elementsMap, element.originIndex)
        }
      })
    }
  })
}

function getRules(types, layers) {
  return _.map(types, type => {
    return {
      type: type.type,
      layers: getLayerWithElementValues(type, layers)
    }
  })
}

function getLayerConfiguration(layers) {
  return _.sortBy(layers, layer => layer.order)
    .filter(layer => _.some(layer.elements, element => element.value))
    .map(layer => {
      return {name: layer.layer}
    })
}

module.exports = {
  rowWithIndex,
  readLayers,
  allElements,
  layerElements,
  getTypes,
  getRules,
  getElementsMap,
  readRules,
  getLayerConfiguration
}

// readRules()
