/*
<head>
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'">
  <meta http-equiv="X-Content-Security-Policy" content="default-src 'none'">
  <meta http-equiv="X-WebKit-CSP" content="default-src 'none'">
  <title>Something</title>
</head>
siehe:
https://wiki.selfhtml.org/wiki/Sicherheit/Content_Security_Policy
https://content-security-policy.com/none/

*/

function stringToUint(string) {
    const charList = string.split('')
    const uintArray = []
    for (var i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0))
    }
    return new Uint8Array(uintArray)
}

function getRandomHexBytes(bytesCount) {
    const array = new Uint8Array(bytesCount);
    window.crypto.getRandomValues(array);
    return uint8Array2hex(array)
}

function uint8Array2hex(uint8Array) {
    return [...uint8Array].map(x => x.toString(16).padStart(2, '0')).join('');
}

function splitStringAfter32Character(text) {
    return text.match(/.{1,32}/g)
}

function addNewRandomSecret() {
    const pseudonym = getRandomHexBytes(4)
    const secret = getRandomHexBytes(32)
    secrets = JSON.parse(document.getElementById("secrets").value)
    if (secrets.some(x => x.secret === secret)) {
        addNewRandomSecret()
    } else {
        secrets.push({name: "", pseudonym, secret})
        document.getElementById("secrets").value = JSON.stringify(secrets, null, 2)
        onChange()
    }
}

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

async function onChange() {
    let decryptInformations = {}
    secrets = JSON.parse(document.getElementById("secrets").value)
    config = JSON.parse(document.getElementById("config").value)
    const keysValid = combinationModule().areKeysValid(config.keys)
    document.getElementById("decryptInformations").value = ""
    document.getElementById("output").value = ""
    document.getElementById("batchfile").value = ""
    if (!keysValid) {
        document.getElementById("decryptInformations").value = "keys invalid"
    } else {
        document.getElementById("qrcodes").innerHTML = ""
        for (x of secrets) {
            const div = document.createElement("div")
            div.classList.add("key")
            const keylabel1 = document.createElement("div")
            const keylabel2 = document.createElement("div")
            const keylabel3 = document.createElement("div")
            const keylabel4 = document.createElement("div")
            const keylabelHtml = "Pseudonym: "+x.pseudonym+" - Secret: <br>"+ (splitStringAfter32Character(x.secret).join('<br/>'))
            const keylabelNamePrefixHtml = "Name: "+x.name+" - "
            keylabel1.innerHTML = keylabelNamePrefixHtml + keylabelHtml
            keylabel2.innerHTML = keylabelNamePrefixHtml + keylabelHtml
            keylabel3.innerHTML = keylabelHtml
            keylabel4.innerHTML = keylabelHtml
            keylabel1.classList.add("keylabel")
            keylabel2.classList.add("keylabel")
            keylabel3.classList.add("keylabel")
            keylabel4.classList.add("keylabel")
            keylabel1.classList.add("keylabel1")
            keylabel2.classList.add("keylabel2")
            keylabel3.classList.add("keylabel3")
            keylabel4.classList.add("keylabel4")
            const image = document.createElement("img")
            image.src = new QRious({
                value: x.pseudonym+"-"+x.secret,
                level: 'H',
                padding: 45,
                size: 600,
            }).toDataURL()
            image.classList.add("image")
            div.appendChild(keylabel1)
            div.appendChild(keylabel3)
            div.appendChild(image)
            div.appendChild(keylabel4)
            div.appendChild(keylabel2)
            document.getElementById("qrcodes").appendChild(div)
        }

        const combinedKeys = JSON.parse(JSON.stringify(config.keys))
        for (x of combinedKeys) {
            const filteredSecrets = secrets.filter(y => y.pseudonym == x.pseudonym)
            if (filteredSecrets.length < 1) {
                const errorString = "could not find secret for pseudonym "+x.pseudonym
                document.getElementById("decryptInformations").value = errorString
                throw errorString
            }
            x.secret = filteredSecrets[0].secret
            if (x.name != filteredSecrets[0].name) {
                const errorString = "name mismatch for pseudonym "+x.pseudonym
                document.getElementById("decryptInformations").value = errorString
                throw errorString
            }
            x.checksum = (await getSha384HexString("checksum-" + x.pseudonym + "-" + x.secret)).substring(0,4)
        }

        decryptInformations = {}
        decryptInformations.readme = "Jeder Key hat ein Pseudonym von 8-Hexchars und ein Secret von 64-Hexchars. Die 7z-Dateien heissen z.b. 'encrypted-SHA-384-37caa23a-455e34dd-516da482.7z'. Da heisst, dass man diese Datei entschluesseln kann indem man die Secrets der drei Key 37caa23a, 455e34dd und 516da482 genau in der Reinfolge hintereinander schreibt (also in dem fall 192 Hexchars) und diese dann mit SHA-384 hasht und das Ergebnis sich wieder in Hex ausgeben laesst. Das ist dann das Passwort um die 7z-Datei zu entpacken. - oder man nimmt den Decrypter unter https://askeron.github.io/shared-secret/decrypt/"
        decryptInformations.keys = JSON.parse(JSON.stringify(config.keys))
        decryptInformations.keys.forEach(x => {
            x.key = undefined
        })
        decryptInformations.combinations = combinationModule().getCombinationsForRootCombinations(config.combinations)
        decryptInformations.combinationsConfiguration = config.combinations

        decryptInformations.keys.forEach(x => {
            x.checksum = combinedKeys.filter(y => y.pseudonym == x.pseudonym)[0].checksum
        })
        document.getElementById("decryptInformations").value = "let decryptInformations = " + JSON.stringify(decryptInformations, null, 2)
        const combinations = decryptInformations.combinations.map(combination => {
            return {
                keys: combination.map(keyName => {
                    return combinedKeys.filter(x => x.name == keyName)[0]
                })
            }
        })
        for (combination of combinations) {
            sortBy(combination.keys, x => x.pseudonym)
            combination.preHashedPassword = combination.keys.map(x => combinedKeys.filter(y => y.pseudonym == x.pseudonym)[0].secret).join('')
            combination.password = await getSha384HexString(combination.preHashedPassword)
            combination.filenameSegment = combination.keys.map(x => x.pseudonym).join('-')
        }
        document.getElementById("output").value = JSON.stringify(combinations, null, 1)

        // tools\7-ZipPortable\App\7-Zip\7z.exe a output/###HASH_FUNCTION_NAME###-###KEY_INDEX_STRING###.7z -p###PASSWORD### -mhe data/secret.txt
        const batchfile = combinations.map(x => "tools\\7-ZipPortable\\App\\7-Zip\\7z.exe a encrypted-SHA-384-"+x.filenameSegment+".7z -p"+x.password+" -mhe secret.txt").join('\n')
        document.getElementById("batchfile").value = batchfile+"\n"
        
    }
}
document.getElementById("secrets").value = JSON.stringify(secrets, null, 2)
document.getElementById("config").value = JSON.stringify(config, null, 2)
onChange()
