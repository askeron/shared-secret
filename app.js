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
    return Buffer.from(uint8).toString('hex')
}

async function getSha384HexString(string) {
    const msgUint8 = new TextEncoder().encode(string);                            // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-384', msgUint8);           // hash the message
    /*
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
    */
    return Buffer.from(new Uint8Array(hashBuffer)).toString('hex')
}

function sortBy(array, mapFunction) {
    const f = mapFunction
    return array.sort((a,b) => (f(a) > f(b)) ? 1 : ((f(b) > f(a)) ? -1 : 0))
}

async function onChange() {
    let decryptInformations = {}
    secrets = JSON.parse(document.getElementById("secrets").value)
    config = JSON.parse(document.getElementById("config").value)
    const keysValid = combinationModule(config.keys).areKeysValid()
    if (!keysValid) {
        document.getElementById("decryptInformations").value = "keys invalid"
    } else {
        decryptInformations = {}
        decryptInformations.keys = JSON.parse(JSON.stringify(config.keys))
        decryptInformations.keys.forEach(x => {
            x.key = undefined
        })
        decryptInformations.combinations = combinationModule(config.keys).getCombinationsForRootCombinations(config.combinations)
        decryptInformations.readme = "Jeder Key hat ein Pseudonym von 8-Hex-Chars und einen "
        document.getElementById("decryptInformations").value = JSON.stringify(decryptInformations, null, 1)
        const combinedKeys = JSON.parse(JSON.stringify(config.keys))
        for (x of combinedKeys) {
            const filteredSecrets = secrets.filter(y => y.pseudonym == x.pseudonym)
            if (filteredSecrets.length < 1) {
                const errorString = "could not find secret for pseudonym "+x.pseudonym
                document.getElementById("output").value = errorString
                throw errorString
            }
            x.secret = filteredSecrets[0].secret
            x.checksum = (await getSha384HexString("checksum-" + x.pseudonym + "-" + x.secret)).substring(0,4)
        }
        const combinations = decryptInformations.combinations.map(combination => {
            return {
                keys: combination.map(keyName => {
                    return combinedKeys.filter(x => x.name == keyName)[0]
                })
            }
        })
        for (combination of combinations) {
            sortBy(combination.keys, x => x.pseudonym)
            combination.preHashedPassword = combination.keys.map(x => x.secret).join('')
            combination.password = await getSha384HexString(combination.preHashedPassword)
            combination.filenameSegment = combination.keys.map(x => x.pseudonym).join('-')
        }
        document.getElementById("output").value = JSON.stringify(combinations, null, 1)

        // tools\7-ZipPortable\App\7-Zip\7z.exe a output/###HASH_FUNCTION_NAME###-###KEY_INDEX_STRING###.7z -p###PASSWORD### -mhe data/secret.txt
        const batchfile = combinations.map(x => "tools\\7-ZipPortable\\App\\7-Zip\\7z.exe a encrypted-SHA-384-"+x.filenameSegment+".7z -p"+x.password+" -mhe secret.txt").join('\n')
        document.getElementById("batchfile").value = batchfile
        
        document.getElementById("qrcodes").innerHTML = ""

        for (x of combinedKeys) {
            const div = document.createElement("div")
            div.style = "min-height: 1px; max-width: 500px; page-break-before: always; text-align: center"
            const title = document.createElement("h3")
            title.innerText = "Key "+x.pseudonym+" - "+x.name
            /*
            new QRCode(div, {
                text: x.pseudonym+"-"+x.secret,
                width: 512,
                height: 512,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            })
            */
            const image = document.createElement("img")
            image.src = new QRious({
                value: x.pseudonym+"-"+x.secret,
                level: 'H',
                padding: 20,
                size: 400,
            }).toDataURL()
            div.appendChild(title)
            div.appendChild(image)
            document.getElementById("qrcodes").appendChild(div)
        }
    }
}
document.getElementById("secrets").value = JSON.stringify(secrets, null, 1)
document.getElementById("config").value = JSON.stringify(config, null, 1)
onChange()