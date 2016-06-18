var Powers = {
	"Unarmed Attack" : {
		"name" :"Unarmed Attack",
		"type" : "At-Will",
		"flavor" : "Высоко хужоэественный текст.",
		"keyWords" : "Arcana, Bull",
		"attacks" : [
			{
				"action" : "Standart",
				"attack" : ["M"], 
			 	"range" : "Пукопашное оружие",  
			 	"ability" : "STR",
			 	"defense" : "AC",
			 	"target" : "Одно существо", 
				"effect": [{
					"text": [{
						"bold": "Попадание:",
						"text": "Урон 1[Ор] + модификатор силы. "
					}, {
						"text": "На 21 уровне урон увеличивается до 2[Ор] + модификато силы."
					}],
					"use" : {
					}
				}],
				"use" : {
					"roll" : function(character) {
						if (character.level > 20) {
							return "W + W + STR"
						} else {
							return "W + STR"
						}
					}
				}
			}
		],
	},
	"Melee Basic Attack" : {
		"name" :"Melee Basic Attack",
		"type" : "Encounter",
		"flavor" : "Высоко хужоэественный текст.",
		"keyWords" : "Arcana, Bull",
		"attacks" : [
			{
				"action" : "Standart",
				"attack" : ["ranged"], 
			 	"range" : "Дальнобойное ружие",  
			 	"ability" : "DEX",
			 	"defense" : "AC",
			 	"target" : "Цель", 
			}
		],
		"count": 2
	},
	"Ranged Basic Attack" : {
		"name" :"Ranged Basic Attack",
		"type" : "Daily",
		"flavor" : "Высоко хужоэественный текст.",
		"keyWords" : "Arcana, Bull",
		"attacks" : [
			{
				"action" : "Standart",
				"attack" : ["ranged"], 
			 	"range" : "Дальнобойное ружие",  
			 	"ability" : "DEX",
			 	"defense" : "AC",
			 	"target" : "Цель", 
			}
		],
		"count": 1
	},
}