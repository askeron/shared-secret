function combinationModule() {
    function areKeysValid(keys) {
        return !hasArrayDuplicates(keys.map(x => x.name)) && !hasArrayDuplicates(keys.map(x => x.pseudonym))
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
        const combinations = rootCombinations.flatMap(x => getCombinationsForRootCombination(x));
        return getCleanedUpCombinations(combinations);
    }

    function getCombinationsForRootCombination(rootCombination) {
        if (rootCombination.type === "staticCombinations") {
            return getCleanedUpCombinations(rootCombination.combinations);
        } else if (rootCombination.type === "elementsAndAmountsCombinations") {
            return getCombinationsForElementsAndAmountsCombinationsObject(rootCombination);
        } else {
            throw new Error("unknown rootCombination.type");
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
            } else {
                throw new Error("unknown elementsAndAmountsCombinationsObject.elements.type");
            }
            elementsKeyNames.push(keyNames);
        }
        for (const validAmountCombination of elementsAndAmountsCombinationsObject.validAmountCombinations) {
            if (validAmountCombination.length === 0) {
                throw new Error("validAmountCombination.length === 0");
            }
            if (elementsAndAmountsCombinationsObject.elements.length != validAmountCombination.length) {
                throw new Error("elementsAndAmountsCombinationsObject.elements.length != validAmountCombination.length");
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
            //console.log("combinations for "+validAmountCombination+": "+JSON.stringify(combinationsForThisEntry));
        }
        return getCleanedUpCombinations(combinations);
    }

    function getCombinationsFromKeyNamesAndCount(keyNames, count) {
        if (count === 0) {
            throw new Error("count === 0");
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
        const distinctAndSortedCombinations = getDistinctElementsSorted(
            inputCombinations.map(x => JSON.stringify(getDistinctElementsSorted(x)))
            ).map(x => JSON.parse(x))
        return getDeduplicatedCombinations(distinctAndSortedCombinations);
    }

    function getDistinctElementsSorted(array) {
        return getSortedElements(getDistinctElements(array));
    }

    function getDistinctElements(array) {
        return [...new Set(array)];
    }

    function getSortedElements(array) {
        const result = array.map(x => x);
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