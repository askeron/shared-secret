let config = {
    "keys": [
        {
            "name": "Sven",
            "pseudonym": "05a0ab13",
        },
        {
            "name": "Bjoern",
            "pseudonym": "37caa23a",
        },
        {
            "name": "Margot",
            "pseudonym": "455e34dd",
        },
    ],
    "combinations":[
        {
            "type": "staticCombinations",
            "combinations": [
                [
                    "Sven",
                    "Bjoern",
                ],
                [
                    "Sven",
                    "Margot",
                ],
                [
                    "Bjoern",
                    "Margot",
                ],
            ],
        },
        {
            "type": "elementsAndAmountsCombinations",
            "elements": [
                {
                    "type": "keyNamesList",
                    "name": "Gruppe Familie",
                    "keyNames": [
                        "Sven",
                        "Bjoern",
                    ]
                },
                {
                    "type": "keyNamesList",
                    "name": "Gruppe Bekannte",
                    "keyNames": [
                        "Margot",
                    ]
                },
            ],
            "validAmountCombinations": [
                [1,1]

/*
                // das sind die abgesegneten Kombination von Vatern START
                [2,1,1,1],

                [2,2,2,0],
                [2,2,0,2],
                [2,0,2,2],

                [1,2,1,1],
                [1,1,2,1],
                [1,1,1,2],

                [1,3,2,0],
                [1,3,0,2],
                [1,2,3,0],
                [1,2,0,3],
                [1,0,3,2],
                [1,0,2,3],
                // das sind die abgesegneten Kombination von Vatern END



                [1,0,0,0],
                [0,1,0,0],
                [1,1,0,0],
                [2,0,0,0],
                [2,1,0,0],
                [3,0,0,0],
                [0,2,0,0],
                */
            ]
        },
    ],
}

