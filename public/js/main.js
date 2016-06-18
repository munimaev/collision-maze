var Main = function(init) {
	this.characters = {};
	if (init.hasOwnProperty('characters')) {
		for (var i in init.characters) {
			this.characters[init.characters[i].name] = new Char(init.characters[i]);
		}
	}
	this.currentChar = null;
	this.changeCharacterInBar = function(id) {
		this.characters[id].addSelfToBar();
		this.currentChar = this.characters[id];
	}
	this.selectTab = function(tab) {
		if (this.currentChar) {
			this.currentChar.charSheets[0].selectTab(tab);
		}
	}
	this.selectPowerTab = function(tab) {
		if (this.currentChar) {
			this.currentChar.charSheets[0].selectPowerTab(tab);
		}
	}
	this.showPreviewPower = function(name) {
		if (this.currentChar) {
			this.currentChar.charSheets[0].selectPower(name);
		}
	}
	this.showPreviewItem = function(name) {
		if (this.currentChar) {
			this.currentChar.charSheets[0].selectItem(name);
		}	
	}
	this.usePower = function(name) {
		if (this.currentChar) {
			console.log(name)
		}	
	}
}