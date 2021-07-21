let decryptInformations = {
  "readme": "Jeder Key hat ein Pseudonym von 8-Hexchars und ein Secret von 64-Hexchars. Die 7z-Dateien heissen z.b. 'encrypted-SHA-384-37caa23a-455e34dd-516da482.7z'. Da heisst, dass man diese Datei entschluesseln kann indem man die Secrets der drei Key 37caa23a, 455e34dd und 516da482 genau in der Reinfolge hintereinander schreibt (also in dem fall 192 Hexchars) und diese dann mit SHA-384 hasht und das Ergebnis sich wieder in Hex ausgeben laesst. Das ist dann das Passwort um die 7z-Datei zu entpacken.",
  "keys": [
    {
      "name": "Sven",
      "pseudonym": "05a0ab13",
      "checksum": "bdec"
    },
    {
      "name": "Bjoern",
      "pseudonym": "37caa23a",
      "checksum": "6a0c"
    },
    {
      "name": "Margot",
      "pseudonym": "455e34dd",
      "checksum": "f147"
    }
  ],
  "combinations": [
    [
      "Bjoern",
      "Margot"
    ],
    [
      "Bjoern",
      "Sven"
    ],
    [
      "Margot",
      "Sven"
    ]
  ],
  "combinationsConfiguration": [
    {
      "type": "staticCombinations",
      "combinations": [
        [
          "Sven",
          "Bjoern"
        ],
        [
          "Sven",
          "Margot"
        ],
        [
          "Bjoern",
          "Margot"
        ]
      ]
    },
    {
      "type": "elementsAndAmountsCombinations",
      "elements": [
        {
          "type": "keyNamesList",
          "name": "Gruppe Familie",
          "keyNames": [
            "Sven",
            "Bjoern"
          ]
        },
        {
          "type": "keyNamesList",
          "name": "Gruppe Bekannte",
          "keyNames": [
            "Margot"
          ]
        }
      ],
      "validAmountCombinations": [
        [
          1,
          1
        ]
      ]
    }
  ]
}