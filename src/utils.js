const _ = require('lodash')

const isNotUndefined = (value) => {
  return !_.isUndefined(value)
}

module.exports = {isNotUndefined}
