let keys = []

async function getSha384HexString(string) {
    const msgUint8 = new TextEncoder().encode(string);                            // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-384', msgUint8);           // hash the message
    ///*
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
    //*/
    //return Buffer.from(new Uint8Array(hashBuffer)).toString('hex')
}

function sortBy(array, mapFunction) {
    const f = mapFunction
    return array.sort((a,b) => (f(a) > f(b)) ? 1 : ((f(b) > f(a)) ? -1 : 0))
}

function addKeyManually() {
    addKey(document.getElementById("pseudonym").value, document.getElementById("secret").value)
}

function addKey(pseudonym, secret) {
    keys = JSON.parse(document.getElementById("keys").value)
    keys.push({pseudonym, secret})
    document.getElementById("keys").value = JSON.stringify(keys, null, 2)
    onChange()
}

async function asyncFilter (arr, predicate) {
    return await (Promise.all(arr.map(predicate)).then((results) => arr.filter((_v, index) => results[index])));
} 

async function onChange() {
    decryptInformations = JSON.parse(document.getElementById("decrypt-informations").value)
    keys = JSON.parse(document.getElementById("keys").value)

    const enhancedKeys = JSON.parse(JSON.stringify(decryptInformations.keys))
    keys.forEach(x => {
        const keyToEnhance = enhancedKeys.filter(y => y.pseudonym == x.pseudonym).shift()
        if (keyToEnhance) {
            keyToEnhance.secret = x.secret
        } else {
            alert(`key with pseudonym '${x.pseudonym}' not found`)
        }
    })
    const enhancedKeysWithSecret = enhancedKeys.filter(x => x.secret != undefined)
    for (const key of enhancedKeysWithSecret) {
        key.calculatedChecksum = (await getSha384HexString("checksum-" + key.pseudonym + "-" + key.secret)).substring(0,4)
    }
    console.log(enhancedKeysWithSecret)

    const keysWithInvalidChecksum = enhancedKeysWithSecret.filter(x => x.checksum != x.calculatedChecksum)

    keysWithInvalidChecksum.forEach(x => alert(`secret of key with pseudonym '${x.pseudonym}' does not match checksum`))
    if (keysWithInvalidChecksum.length > 0) {
        return
    }
    
    const validKeyCombinations = decryptInformations.combinations.map(x => x.map(y => enhancedKeysWithSecret.filter(z => z.name == y)[0]))
        .filter(x => x.every(y => y != undefined && y.secret != undefined))
    
    const combinationTexts = (await (Promise.all(validKeyCombinations.map(async x => {
        const combinationKeys = x
        sortBy(combinationKeys, x => x.pseudonym)
        const preHashedPassword = combinationKeys.map(x => x.secret).join('')
        const password = await getSha384HexString(preHashedPassword)
        const filenameSegment = combinationKeys.map(x => x.pseudonym).join('-')
        return "you can decrypt encrypted-SHA-384-"+filenameSegment+".7z with the password "+password
    }))))
    
    document.getElementById("output").value = "found "+combinationTexts.length+" useable combinations with the given keys\n"+combinationTexts.join("\n")
}

document.getElementById("decrypt-informations").value = JSON.stringify(decryptInformations, null, 2)
document.getElementById("keys").value = JSON.stringify(keys, null, 2)
onChange()

// barcode scanner

function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult)
    
}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`)
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 }, /* verbose= */ false)
html5QrcodeScanner.render(onScanSuccess, onScanFailure)