{
	"targets": [
		{
			"target_name": "internal",
			"sources": [ "src/index.cpp" ]
		},
		{
			"target_name": "copy",
			"type": "none",
			"dependencies": [ "internal" ],
			"copies": [
				{
					"files": [ "<(PRODUCT_DIR)/internal.node" ],
					"destination": "./build"
				}
			]
		}
	]
}