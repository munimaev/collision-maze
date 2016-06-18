var Char = function(init) {
	this.level = init.level;
	this.race = init.race;
	this.klass = init.klass;
	this.raceAbility = init.raceAbility;
	this.ability = {
		STR : 0,
		DEX : 0,
		CON : 0,
		INT : 0,
		WIS : 0,
		CHA : 0,
	}
	this.abilityStart = {
		STR : 0,
		DEX : 0,
		CON : 0,
		INT : 0,
		WIS : 0,
		CHA : 0,
	}
	this.feats = init.feats;
	for (var i in init.ability) {
		this.abilityStart[i] = init.ability[i]; 
		this.ability[i] = init.ability[i];
		if (~this.raceAbility.indexOf(i)) {
			this.ability[i] +=2;
		}
	}
	this.HPmax = 0;
	this.HPblooded = 0;
	this.HPcurrent = init.hasOwnProperty('HP') ? init.HP : null;
	this.HPtemporary = init.hasOwnProperty('temporaryHP') ? init.temporaryHP : 0;
	
	this.surge = {
		value : 0,
		inDay : 0
	}
	this.deathSaving = {
		failures : init.hasOwnProperty('deathSaving') && init.deathSaving.hasOwnProperty("failures") ? init.deathSaving.failures : 0,
		success : init.hasOwnProperty('deathSaving') && init.deathSaving.hasOwnProperty("success") ? init.deathSaving.success : 0
	}
	this.items = init.items || {};
	this.equiped = init.equiped || {};
	this.AC = 80;
	this.FORT = 81;
	this.WILL = 82;
	this.REF = 83;
	this.updHP();
	this.updSurge();
	this.updAllDefenses();
	this.charSheets = []
	this.charSheets[0] = new CharSheet({Char:this});
}

Char.prototype.getMod = function(ability, value) {
	var value = ability ? this.ability[ability] : value;
	var result = (value - 10) / 2;
	result = Math.floor(result);
	return result;
}
Char.prototype.getSkillMod = function(skillName) {
	var ability = this.skillsList[skillName];
	var result = this.getMod(ability) + Math.floor(this.level/  2);
	for (var i in this.feats) {
		var feat =this.feats[i]; 
		if (Feats[feat].hasOwnProperty('mod')
			&& Feats[feat].mod.hasOwnProperty(skillName)) {
			result += Feats[feat].mod[skillName]({charObj:this});
		}
	}
	return result;
}

Char.prototype.getModPrint = function(ability ,value) {
	var result = this.getMod(ability, value);
	return this.getAnyModPrint(result);
}
Char.prototype.getAnyModPrint = function(value) {
	if (value >= 0) {
		value = '+'+value;
	}
	value += '';
	return value;
}


Char.prototype.changeAbility = function(ability, value) {
	this.abilityStart[ability] = value; 
	if (~this.raceAbility.indexOf(ability)) {
		value +=2;
	}
	this.ability[ability] = value;
	for (var i in this.charSheets) {
		this.charSheets[i].updAbility(ability, value);
		this.charSheets[i].updAllSkil();
		this.charSheets[i].updInitiative();
	}
}
Char.prototype.changeLevel = function(value) {
	this.level = value;
	for (var i in this.charSheets) {
		this.charSheets[i].updLevel();
		this.charSheets[i].updAllSkil();
		for (var j in this.ability) {
			this.charSheets[i].updAbility(j);
		}
		this.charSheets[i].updInitiative();
	}
}
Char.prototype.addFeat = function(featName) {
	this.feats.push(featName);
	this.charSheets[i].updAllSkil();
}
Char.prototype.updHP = function(){
	this.HPmax = Classes[this.klass].HP.firstLevel + Classes[this.klass].HP.otherLevel * (this.level - 1);
	this.HPblooded = Math.floor( this.HPmax / 2);
}
Char.prototype.updSurge = function(){
	this.surge.value = Math.floor( this.HPmax / 4);
	this.surge.inDay = this.getMod('CON') + Classes[this.klass].surge;
}

Char.prototype.skillsList = {
	"Acrobatic"    : "DEX",
	"Arcana"       : "INT",
	"Athletic"     : "STR",
	"Bluff"        : "CHA",
	"Diplomacy"    : "CHA",
	"Dungeonering" : "CHA",
	"Endurance"    : "CON",
	"Heal"         : "WIS",
	"History"      : "INT",
	"Insight"      : "WIS",
	"Intimidate"   : "CHA",
	"Nature"       : "WIS",
	"Perception"   : "WIS",
	"Religion"     : "INT",
	"Stealth"      : "DEX",
	"Streetwise"   : "CHA",  
	"Thievory"     : "DEX",
}
Char.prototype.slotList = [
	"Main weapon",
	"Additional weapon",
	"Armor",
	"Arms",
	"Feet",
	"Hands",
	"Head",
	"Neck",
	"Ring1",
	"Ring2",
	"Waist"
]

Char.prototype.addSelfToBar = function() {
	if (this.charSheets.length) {
		this.charSheets[0].addSelfToBar();
	}
}
/*---------*/

Char.prototype.updAllDefenses = function() {
	this.updAC();
	this.updFORT();
	this.updWILL();
	this.updREF();
}

Char.prototype.updAC = function() {
	this.AC = 10 + Math.floor(this.level / 2);
}
Char.prototype.updFORT = function() {
	var abilityMod = this.ability.STR > this.ability.CON ? this.getMod('STR') : this.getMod('CON');
	this.FORT = 10 + Math.floor(this.level / 2) + abilityMod;
}
Char.prototype.updREF = function() {
	var abilityMod = this.ability.DEX > this.ability.INT ? this.getMod('DEX') : this.getMod('INT');
	this.REF = 10 + Math.floor(this.level / 2) + abilityMod;
}
Char.prototype.updWILL = function() {
	var abilityMod = this.ability.WIS > this.ability.CHA ? this.getMod('WIS') : this.getMod('CHA');
	this.WILL = 10 + Math.floor(this.level / 2) + abilityMod;
}

Char.prototype.powersBase = [
	"Unarmed Attack",
	"Melee Basic Attack",
	"Ranged Basic Attack"
]