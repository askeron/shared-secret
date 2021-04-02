function combinationModule(keys) {
    function areKeysValid() {
        return !hasArrayDuplicates(getAllKeyNames()) && !hasArrayDuplicates(keys.map(x => x.pseudonym))
    }

    function getAllKeyNames() {
        return keys.map(x => x.name);
    }

    function hasArrayDuplicates(inputArray) {
        const elements = [];
        for (const element of inputArray) {
            if (elements.includes(element)) {
                return true;
            }
            elements.push(element);
        }
        return false;
    }

    function getCombinationsForRootCombinations(rootCombinations) {
        const combinations = [];
        for (const rootCombination of rootCombinations) {
            for (const x of getCombinationsForRootCombination(rootCombination)) {
                combinations.push(x);
            }
        }
        return getCleanedUpCombinations(combinations);
    }

    function getCombinationsForRootCombination(rootCombination) {
        if (rootCombination.type === "staticCombinations") {
            return getCleanedUpCombinations(rootCombination.combinations);
        } else if (rootCombination.type === "elementsAndAmountsCombinations") {
            return getCombinationsForElementsAndAmountsCombinationsObject(rootCombination);
        } else {
            throw "unknown rootCombination.type";
        }
    }

    function getCombinationsForElementsAndAmountsCombinationsObject(elementsAndAmountsCombinationsObject) {
        const combinations = [];
        const elementsKeyNames = [];
        for (const element of elementsAndAmountsCombinationsObject.elements) {
            const keyNames = [];
            if (element.type === "keyNamesList") {
                for (const keyName of element.keyNames) {
                    keyNames.push(keyName)
                }
            } else if (element.type === "group") {
                for (const key of keys.filter(key => key.group === element.group)) {
                    keyNames.push(key.name);
                }
            } else {
                throw "unknown elementsAndAmountsCombinationsObject.elements.type";
            }
            elementsKeyNames.push(keyNames);
        }
        for (const validAmountCombination of elementsAndAmountsCombinationsObject.validAmountCombinations) {
            if (validAmountCombination.length === 0) {
                throw "validAmountCombination.length === 0";
            }
            if (elementsAndAmountsCombinationsObject.elements.length != validAmountCombination.length) {
                throw "elementsAndAmountsCombinationsObject.elements.length != validAmountCombination.length";
            }
            let combinationsForThisEntry = undefined;
            for (let i = 0; i < validAmountCombination.length; i++) {
                const count = validAmountCombination[i];
                if (count > 0) {
                    const combinationPart = getCombinationsFromKeyNamesAndCount(elementsKeyNames[i], count);
                    if (combinationsForThisEntry === undefined) {
                        combinationsForThisEntry = combinationPart.slice();
                    } else {
                        combinationsForThisEntry = getAndCombinedCombinations(combinationsForThisEntry, combinationPart);
                    }
                }
            }
            if (combinationsForThisEntry !== undefined) {
                for (const x of combinationsForThisEntry) {
                    combinations.push(x);
                }
            }
            console.log("combinations for "+validAmountCombination+": "+JSON.stringify(combinationsForThisEntry));
        }
        return getCleanedUpCombinations(combinations);
    }

    function getCombinationsFromKeyNamesAndCount(keyNames, count) {
        if (count === 0) {
            throw "count === 0";
        }
        const keyNamesCombinations = keyNames.map(x => [x]);
        let result = keyNamesCombinations.slice();
        let roundsLeft = count-1;
        while (roundsLeft > 0) {
            result = getAndCombinedCombinations(result, keyNamesCombinations);
            roundsLeft--;
        }
        return result;
    }

    function getAndCombinedCombinations(combinations1, combinations2) {
        const combinations = [];
        for (const combination1 of combinations1) {
            for (const combination2 of combinations2) {
                let combination = [];
                for (const x of combination1) {
                    combination.push(x)
                }
                for (const x of combination2) {
                    combination.push(x)
                }
                if (!hasArrayDuplicates(combination)) {
                    combinations.push(combination);
                }
            }
        }
        return getCleanedUpCombinations(combinations);
    }


    function getCleanedUpCombinations(inputCombinations) {
        const combinationJsons = [];
        for (const inputCombination of inputCombinations) {
            const combination = getCleanedUpCombination(inputCombination);
            const combinationJson = JSON.stringify(combination);
            if (!combinationJsons.includes(combinationJson)) {
                combinationJsons.push(combinationJson)
            }
        }
        combinationJsons.sort();
        return getDeduplicatedCombinations(combinationJsons.map(x => JSON.parse(x)));
    }

    function getCleanedUpCombination(inputCombination) {
        const result = [];
        for (const x of inputCombination) {
            if (!result.includes(x)) {
                result.push(x)
            }
        }
        result.sort();
        return result;
    }

    function getDeduplicatedCombinations(inputCombinations) {
        const combinations = [];
        for (const inputCombination of inputCombinations) {
            if (inputCombinations.filter(x => isSuperset(inputCombination,x)).length === 0) {
                combinations.push(inputCombination);
            }
        }
        return combinations;
    }

    function isSuperset(superset, subset) {
        return superset.length > subset.length && subset.filter(x => !superset.includes(x)).length === 0
    }

    return {
        getCombinationsForRootCombinations,
        areKeysValid
    }
}