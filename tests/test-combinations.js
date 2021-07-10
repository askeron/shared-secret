function assertEqualObject(actual, expected) {
    const actualJson = JSON.stringify(actual, null, 2)
    const expectedJson = JSON.stringify(expected, null, 2)
    if (actualJson === expectedJson) return
    console.log(`expected:\n${expectedJson}`)
    console.log(`actual:\n${actualJson}`)
    throw new Error("assertEqualObject")
}

function assertError(runnable, expectedErrorMessage) {
    try {
        runnable()
        throw new Error("no error thrown")
    } catch (e) {
        assertEqualObject(e.message, expectedErrorMessage)
    }
}



assertEqualObject(combinationModule().areKeysValid([]), true)
assertEqualObject(combinationModule().areKeysValid([{
    name: "Key A",
    pseudonym: "Pseudonym A",
},{
    name: "Key B",
    pseudonym: "Pseudonym B",
}]), true)
assertEqualObject(combinationModule().areKeysValid([{
    name: "Key A",
    pseudonym: "Pseudonym A",
},{
    name: "Key A",
    pseudonym: "Pseudonym B",
}]), false)
assertEqualObject(combinationModule().areKeysValid([{
    name: "Key A",
    pseudonym: "Pseudonym A",
},{
    name: "Key B",
    pseudonym: "Pseudonym A",
}]), false)





function getStaticCombinations(keyLettersCommaSeperated) {
    return {
        "type": "staticCombinations",
        "combinations": keyLettersCommaSeperated.split(',').map(x => Array.from(x).map(y => `${y}`)),
    }
}

assertEqualObject(getStaticCombinations("BCD,ACD,ABD,ABC"),{
    "type": "staticCombinations",
    "combinations": [
      [
        "B",
        "C",
        "D"
      ],
      [
        "A",
        "C",
        "D"
      ],
      [
        "A",
        "B",
        "D"
      ],
      [
        "A",
        "B",
        "C"
      ]
    ]
  })

    assertEqualObject(combinationModule().getCombinationsForRootCombinations([
        getStaticCombinations("BCD,ACD,ABD,ABC"),
        ]).map(x => x.join("")).join(","), "ABC,ABD,ACD,BCD")

    assertEqualObject(combinationModule().getCombinationsForRootCombinations([
        getStaticCombinations("BCD,ACD"),
        getStaticCombinations("ABD,ABC"),
        ]).map(x => x.join("")).join(","), "ABC,ABD,ACD,BCD")

    assertEqualObject(combinationModule().getCombinationsForRootCombinations([
        getStaticCombinations("BCD,ACD,ABD"),
        getStaticCombinations("ABD,ABC"),
        ]).map(x => x.join("")).join(","), "ABC,ABD,ACD,BCD")

    assertEqualObject(combinationModule().getCombinationsForRootCombinations([
        getStaticCombinations("BCD,ACD,ABD,ABC"),
        getStaticCombinations("BCD,AB,ABD,ACD"),
        ]).map(x => x.join("")).join(","), "AB,ACD,BCD")
        
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

function subtestMain(validAmountCombinations, expected) {
    assertEqualObject(combinationModule().getCombinationsForRootCombinations([
        getCombConfigForValidAmountCombinations(validAmountCombinations),
      ]).map(x => x.join("")).join(","), expected)
}


assertError(() => subtestMain([[]], []), "validAmountCombination.length === 0")
assertError(() => subtestMain([[1]], []), "elementsAndAmountsCombinationsObject.elements.length != validAmountCombination.length")
subtestMain([[0,0,0]], "")
subtestMain([[0,1,0]], "2A,2B,2C")
subtestMain([[0,2,0]], "2A2B,2A2C,2B2C")
subtestMain([[0,3,0]], "2A2B2C")
subtestMain([[0,4,0]], "")
subtestMain([[0,1,1]], "2A3A,2A3B,2A3C,2B3A,2B3B,2B3C,2C3A,2C3B,2C3C")
subtestMain([[1,1,1]], "1A2A3A,1A2A3B,1A2A3C,1A2B3A,1A2B3B,1A2B3C,1A2C3A,1A2C3B,1A2C3C,1B2A3A,1B2A3B,1B2A3C,1B2B3A,1B2B3B,1B2B3C,1B2C3A,1B2C3B,1B2C3C,1C2A3A,1C2A3B,1C2A3C,1C2B3A,1C2B3B,1C2B3C,1C2C3A,1C2C3B,1C2C3C")
subtestMain([[0,1,2]], "2A3A3B,2A3A3C,2A3B3C,2B3A3B,2B3A3C,2B3B3C,2C3A3B,2C3A3C,2C3B3C")
console.log("combinations test successful")
