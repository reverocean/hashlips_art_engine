const {
  rowWithIndex,
  readLayers,
  allElements,
  layerElements,
  getTypes,
  getRules,
  getElementsMap,
  getLayerConfiguration
} = require('../src/ruleParser')


test('rowWithIndex should return row with index', () => {
  const rows = [
    ['a'],
    ['b']
  ]

  const expectedRows = [
    [0, 'a'],
    [1, 'b']
  ]

  expect(rowWithIndex(rows)).toEqual(expectedRows)
})

test('allElements should all elements', () => {
  const rows = [
    [0, 'layers', 'order', 'element'],
    [1, 'Background', 1, undefined],
    [2, undefined, undefined, 'Blue'],
    [3, undefined, undefined, 'Brown'],
    [4, undefined, undefined, 'Green'],
    [5, 'Type', 2, undefined],
    [6, undefined, undefined, 'Charcoal mfer'],
    [7, undefined, undefined, 'Punk mfer I'],
  ]

  const elements = [
    {
      originIndex: 1,
      element: undefined
    },
    {
      originIndex: 2,
      element: 'Blue'
    },
    {
      originIndex: 3,
      element: 'Brown'
    },
    {
      originIndex: 4,
      element: 'Green'
    },
    {
      originIndex: 5,
      element: undefined
    },
    {
      originIndex: 6,
      element: 'Charcoal mfer'
    },
    {
      originIndex: 7,
      element: 'Punk mfer I'
    },
  ]
  expect(allElements(rows)).toEqual(elements)
})

test('layerElements should return elements for given layer index', () => {
  const elements = [
    {
      originIndex: 1,
      element: undefined
    },
    {
      originIndex: 2,
      element: 'Blue'
    },
    {
      originIndex: 3,
      element: 'Brown'
    },
    {
      originIndex: 4,
      element: 'Green'
    },
    {
      originIndex: 5,
      element: undefined
    },
    {
      originIndex: 6,
      element: 'Charcoal mfer'
    },
    {
      originIndex: 7,
      element: 'Punk mfer I'
    },
  ]

  const backgroundElement = [
    {
      originIndex: 2,
      element: 'Blue'
    },
    {
      originIndex: 3,
      element: 'Brown'
    },
    {
      originIndex: 4,
      element: 'Green'
    }
  ]

  const typeElements = [
    {
      originIndex: 6,
      element: 'Charcoal mfer'
    },
    {
      originIndex: 7,
      element: 'Punk mfer I'
    }
  ]

  expect(layerElements(elements, 1)).toEqual(backgroundElement)
  expect(layerElements(elements, 5)).toEqual(typeElements)
})

test('readLayers should return layers with elements', () => {
  const rowWithIndexes = [
    [0, 'layers', 'order', 'element'],
    [1, 'Background', 1, undefined],
    [2, undefined, undefined, 'Blue'],
    [3, undefined, undefined, 'Brown'],
    [4, undefined, undefined, 'Green'],
    [5, 'Type', 2, undefined],
    [6, undefined, undefined, 'Charcoal mfer'],
    [7, undefined, undefined, 'Punk mfer I'],
  ]

  const backgroundElement = [
    {
      originIndex: 2,
      element: 'Blue'
    },
    {
      originIndex: 3,
      element: 'Brown'
    },
    {
      originIndex: 4,
      element: 'Green'
    }
  ]

  const typeElements = [
    {
      originIndex: 6,
      element: 'Charcoal mfer'
    },
    {
      originIndex: 7,
      element: 'Punk mfer I'
    }
  ]
  const layers = [
    {
      originIndex: 1,
      layer: 'Background',
      order: 1,
      elements: backgroundElement
    },
    {
      originIndex: 5,
      layer: 'Type',
      order: 2,
      elements: typeElements
    }
  ]

  expect(readLayers(rowWithIndexes)).toEqual(layers)
})


test('types should read all types', () => {
  const rows = [
    [0, 'layers', 'order', 'element', 'Plain mfer', 'Charcoal mfer'],
    [1, 'Background', 1, undefined],
    [2, undefined, undefined, 'Blue', true, true],
    [3, undefined, undefined, 'Brown', true, false],
    [4, undefined, undefined, 'Green', true, true],
    [5, 'Type', 2, undefined],
    [6, undefined, undefined, 'Charcoal mfer', false, true],
    [7, undefined, undefined, 'Punk mfer I', true, false],
  ]

  const expectTypes = [
    {
      type: 'Plain mfer',
      elements: [
        {
          originIndex: 2,
          value: true
        },
        {
          originIndex: 3,
          value: true
        },
        {
          originIndex: 4,
          value: true
        },
        {
          originIndex: 6,
          value: false
        },
        {
          originIndex: 7,
          value: true
        }
      ]
    },
    {
      type: 'Charcoal mfer',
      elements: [
        {
          originIndex: 2,
          value: true
        },
        {
          originIndex: 3,
          value: false
        },
        {
          originIndex: 4,
          value: true
        },
        {
          originIndex: 6,
          value: true
        },
        {
          originIndex: 7,
          value: false
        }
      ]
    }
  ]

  expect(getTypes(rows)).toEqual(expectTypes)
})

test('getRules should return layer and each elements', () => {
  const layers = fixLayers();
  const types = fixTypes();
  const expectRules = [
    {
      type: 'Plain mfer',
      layers: [
        {
          originIndex: 1,
          layer: 'Background',
          order: 1,
          elements: [
            {
              originIndex: 2,
              element: 'Blue',
              value: true,
            },
            {
              originIndex: 3,
              element: 'Brown',
              value: true,
            },
            {
              originIndex: 4,
              element: 'Green',
              value: true,
            }
          ]
        },
        {
          originIndex: 5,
          layer: 'Type',
          order: 2,
          elements: [
            {
              originIndex: 6,
              element: 'Charcoal mfer',
              value: false,
            },
            {
              originIndex: 7,
              element: 'Punk mfer I',
              value: true,
            }
          ]
        }
      ]
    },
    {
      type: 'Charcoal mfer',
      layers: [
        {
          originIndex: 1,
          layer: 'Background',
          order: 1,
          elements: [
            {
              originIndex: 2,
              element: 'Blue',
              value: true,
            },
            {
              originIndex: 3,
              element: 'Brown',
              value: false,
            },
            {
              originIndex: 4,
              element: 'Green',
              value: true,
            }
          ]
        },
        {
          originIndex: 5,
          layer: 'Type',
          order: 2,
          elements: [
            {
              originIndex: 6,
              element: 'Charcoal mfer',
              value: true,
            },
            {
              originIndex: 7,
              element: 'Punk mfer I',
              value: false,
            }
          ]
        }
      ]
    }
  ]

  expect(getRules(types, layers)).toEqual(expectRules)
})

test('getElementsMap should return element origin index and value map', () => {
  const elements = [
    {
      originIndex: 2,
      value: true
    },
    {
      originIndex: 3,
      value: true
    },
    {
      originIndex: 4,
      value: true
    },
    {
      originIndex: 6,
      value: false
    },
    {
      originIndex: 7,
      value: true
    }
  ]

  const elementsMap = {
    2: true,
    3: true,
    4: true,
    6: false,
    7: true,
  }

  expect(getElementsMap(elements)).toEqual(elementsMap)
})

test('getLayerConfiguration should return layers and ordered', () => {
  const rule1 = {
    type: 'Plain mfer',
    layers: [
      {
        originIndex: 1,
        layer: 'Background',
        order: 1,
        elements: [
          {
            originIndex: 2,
            element: 'Blue',
            value: true,
          },
          {
            originIndex: 3,
            element: 'Brown',
            value: true,
          },
          {
            originIndex: 4,
            element: 'Green',
            value: true,
          }
        ]
      },
      {
        originIndex: 5,
        layer: 'Type',
        order: 2,
        elements: [
          {
            originIndex: 6,
            element: 'Charcoal mfer',
            value: false,
          },
          {
            originIndex: 7,
            element: 'Punk mfer I',
            value: true,
          }
        ]
      }
    ]
  }
  const rule2 = {
    type: 'Charcoal mfer',
    layers: [
      {
        originIndex: 1,
        layer: 'Background',
        order: 2,
        elements: [
          {
            originIndex: 2,
            element: 'Blue',
            value: true,
          },
          {
            originIndex: 3,
            element: 'Brown',
            value: false,
          },
          {
            originIndex: 4,
            element: 'Green',
            value: true,
          }
        ]
      },
      {
        originIndex: 5,
        layer: 'Type',
        order: 1,
        elements: [
          {
            originIndex: 6,
            element: 'Charcoal mfer',
            value: true,
          },
          {
            originIndex: 7,
            element: 'Punk mfer I',
            value: false,
          }
        ]
      }
    ]
  }

  const rule1Configuration = [
    {name: "Background"},
    {name: "Type"}
  ]


  const rule2Configuration = [
    {name: "Type"},
    {name: "Background"},
  ]

  expect(getLayerConfiguration(rule1.layers)).toEqual(rule1Configuration)
  expect(getLayerConfiguration(rule2.layers)).toEqual(rule2Configuration)
})

function fixTypes() {
  return [
    {
      type: 'Plain mfer',
      elements: [
        {
          originIndex: 2,
          value: true
        },
        {
          originIndex: 3,
          value: true
        },
        {
          originIndex: 4,
          value: true
        },
        {
          originIndex: 6,
          value: false
        },
        {
          originIndex: 7,
          value: true
        }
      ]
    },
    {
      type: 'Charcoal mfer',
      elements: [
        {
          originIndex: 2,
          value: true
        },
        {
          originIndex: 3,
          value: false
        },
        {
          originIndex: 4,
          value: true
        },
        {
          originIndex: 6,
          value: true
        },
        {
          originIndex: 7,
          value: false
        }
      ]
    }
  ]
}

function fixLayers() {

  const backgroundElement = [
    {
      originIndex: 2,
      element: 'Blue'
    },
    {
      originIndex: 3,
      element: 'Brown'
    },
    {
      originIndex: 4,
      element: 'Green'
    }
  ]

  const typeElements = [
    {
      originIndex: 6,
      element: 'Charcoal mfer'
    },
    {
      originIndex: 7,
      element: 'Punk mfer I'
    }
  ]
  return [
    {
      originIndex: 1,
      layer: 'Background',
      order: 1,
      elements: backgroundElement
    },
    {
      originIndex: 5,
      layer: 'Type',
      order: 2,
      elements: typeElements
    }
  ]
}
