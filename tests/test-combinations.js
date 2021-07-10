
function assertEqualObject(actual, expected) {
    const actualJson = JSON.stringify(actual, null, 2)
    const expectedJson = JSON.stringify(expected, null, 2)
    if (actualJson === expectedJson) return
    console.log(`expected:\n${expectedJson}`)
    console.log(`actual:\n${actualJson}`)
    throw new Error("assertEqualObject")
}

function getStaticCombinations(keyLettersCommaSeperated) {
    return {
        "type": "staticCombinations",
        "combinations": keyLettersCommaSeperated.split(',').map(x => Array.from(x).map(y => `Key ${y}`)),
    }
}

assertEqualObject(getStaticCombinations("BCD,ACD,ABD,ABC"),{
    "type": "staticCombinations",
    "combinations": [
      [
        "Key B",
        "Key C",
        "Key D"
      ],
      [
        "Key A",
        "Key C",
        "Key D"
      ],
      [
        "Key A",
        "Key B",
        "Key D"
      ],
      [
        "Key A",
        "Key B",
        "Key C"
      ]
    ]
  })

function getCombConfigForValidAmountCombinations(validAmountCombinations) {
    return {
        "type": "elementsAndAmountsCombinations",
        "elements": [
            {
                "type": "keyNamesList",
                "name": "Group 1",
                "keyNames": [
                    "1A",
                    "1B",
                    "1C",
                ]
            },
            {
                "type": "keyNamesList",
                "name": "Group 2",
                "keyNames": [
                    "2A",
                    "2B",
                    "2C",
                ]
            },
            {
                "type": "keyNamesList",
                "name": "Group 3",
                "keyNames": [
                    "3A",
                    "3B",
                    "3C",
                ]
            },
        ],
        "validAmountCombinations": validAmountCombinations
    }
}

getCombConfigForValidAmountCombinations([[1,1]])
