var CharSheet = function(data) {
	this.character = data.Char;
	this.$ability = {
		STR : null, STR_mod : null, STRname : null,
		DEX : null, DEX_mod : null, DEXname : null,
		CON : null, CON_mod : null, CONname : null,
		INT : null, INT_mod : null, INTname : null,
		WIS : null, WIS_mod : null, WISname : null,
		CHA : null, CHA_mod : null, CHAname : null,
		LV  : null,
	}

	var charObj = data.Char;

	this.$bar = $('#glob_bar')


	this.$tabs = $('<div />', {
		'class' : 'sheet_tabs'
	})
	this.$contents = $('<div />', {
		'class' : 'sheet_contents'
	})
	for (var i in this.namesOfTabs) {
		this['$tab'+this.namesOfTabs[i]] = $('<div />', {
			'class' : 'sheet_tab',
			'onclick' : "main.selectTab('"+this.namesOfTabs[i]+"')"
		});
		this['$tab'+this.namesOfTabs[i]].append($('<img />', {src:'pics/'+this.namesOfTabs[i]+'.png'}));
		this.$tabs.append(this["$tab"+this.namesOfTabs[i]]);

		this['$content'+this.namesOfTabs[i]] = $('<div />', {})
		this.$contents.append(this['$content'+this.namesOfTabs[i]]);
	}
	this.$defenses = $('<div />', {'class': 'sheet_defenses'});
	this.$portret = $('<div />', {
		'class' : 'sheet_portret'
	});


	this.$defenses.append(this.$portret);

	var arr = ['AC', 'FORT', 'REF', 'WILL'];
	for (var i in arr) {
		this['$'+arr[i]] = $('<div />', {
			'class' : 'sheet_defense'
		});
		this.$defenses.append(this["$"+arr[i]]);

		this['$'+arr[i]+'_name'] = $('<div />', {
			'class' : 'sheet_defense_name'
		});
		this["$"+arr[i]].append(this['$'+arr[i]+'_name']);		

		this['$'+arr[i]+'_value'] = $('<div />', {
			'class' : 'sheet_defense_value'
		});
		this["$"+arr[i]].append(this['$'+arr[i]+'_value']);

	}
	this.updAllDefenses();



	this.$HP = $('<div />', {'class':'sheet_HPs'});

	var arr = ['HPcurrent', 'HPtemporary'];
	for (var i in arr) {
		this['$'+arr[i]] = $('<div />', {
			'class' : 'sheet_HP'
		});
		this.$HP.append(this["$"+arr[i]]);

		this['$'+arr[i]+'_name'] = $('<div />', {
			'class' : 'sheet_HP_name'
		});
		this["$"+arr[i]].append(this['$'+arr[i]+'_name']);		

		this['$'+arr[i]+'_value'] = $('<div />', {
			'class' : 'sheet_HP_value'
		});
		this["$"+arr[i]].append(this['$'+arr[i]+'_value']);

	}
	this.updAllHP();

	//--------------------------

	var $ability = $('<table />', {
		"class" : 'sheet_abilitys',
		"cellspacing" :"3",
		"width" : '100%'
	})
	this.$contentskills.append($ability);

	for (var i in data.Char.ability) {
		var $div = $('<tr />', {
			"class" : 'sheet_ability'
		})
		var $name = $('<td />', {
			"class" : 'sheet_ability_name',
			"text" : i
		})
		var $value = $('<td />', {
			"class" : 'sheet_ability_value',
		})
		var $mod = $('<td />', {
			"class" : 'sheet_ability_mod',
		})
		$div.append($name);
		$div.append($value);
		$div.append($mod);
		$ability.append($div);
		this.$ability[i] = $value;
		this.$ability[i+'_mod'] = $mod;

		this.updAbility(i)
	}

	//--------------------------
	// Навыки

	
	var $skills = $('<table />', {
		"class" : 'sheet_skills',
		"cellspacing" :"3",
		"width" : '100%'
	})
	this.$contentskills.append($skills);

	for (var i in this.character.skillsList) {
		var $div = $('<tr />', {
			"class" : 'sheet_skill'
		})
		var $name = $('<td />', {
			"class" : 'sheet_skill_name'
		})
		var $trained = $('<td />', {
			"class" : 'sheet_skill_trained',
		})
		var $value = $('<td />', {
			"class" : 'sheet_skill_value',
		})
		$div.append($name);
		$div.append($trained);
		$div.append($value);
		$skills.append($div);
		this[i] = $value;
		this[i+'_trained'] = $trained;
		this[i+'_name'] = $name;

		this.updSkil(i)
	}


	//--------------------------
	// Теаланты

	this.powersList = {};
	this.powersPreview = {};

	this.$allPowers = $('<div />', {'class':'sheet_allPowers'});
	this.$powersTabs = $('<div />', {'class':'sheet_powersTabs'});
	this.$powersContents = $('<div />', {'class':'sheet_powersContents'});
	this.$allPowers.append(this.$powersTabs);
	this.$allPowers.append(this.$powersContents);

	var arr = this.namesOfPowerTabs;
	for (var i in arr) {

		var nameTab = '$powersTab'+arr[i];
		this[nameTab] = $('<div />', {
			'class' : 'sheet_powersTab',
			'onclick' : "main.selectPowerTab('"+arr[i]+"')",
			'text' : arr[i]
		})
		this.$powersTabs.append(this[nameTab]);

		var nameConternt = '$powersContent'+arr[i];
		this[nameConternt] = $('<div />', {'class' : 'sheet_powersContent'})
		this.$powersContents.append(this[nameConternt]);

	}
	this.updAllPowers();
	this.selectPowerTab(this.namesOfPowerTabs[0]);



	//--------------------------
	// Предметы
	
	this.$inventory = $('<div />', {'class':'sheet_inventory'});
	this.$equiped = $('<div />', {'class':'sheet_equiped'});
	this.$loot = $('<div />', {'class':'sheet_loot'});
	this.$inventory.append(this.$equiped);
	this.$inventory.append(this.$loot);

	this.items = {};
	this.equiped = {};
	this.loot = {};
	this.updEquiped();


	/*------------------*/

	var $sheet = $('<div />', {
		"class" : 'sheet'
	});
	
	var $head = $('<div />', {
		"class" : 'sheet_head',
	})
	$sheet.append($head);

	var $level = $('<div />', {
		"class" : 'sheet_head_level',
	})
	$head.append($level);
	this.$ability.LV = $level;
	this.updLevel();

	//--------------------------


	
	var $initiative = $('<table />', {
		"class" : 'sheet_initiative',
		"cellspacing" :"3"
	})
	$sheet.append($initiative);

		var $div = $('<tr />', {
			"class" : 'sheet_initiative'
		})
		var $name = $('<td />', {
			"class" : 'sheet_initiative_name'
		})
		var $value = $('<td />', {
			"class" : 'sheet_initiative_value',
		})
		$div.append($name);
		$div.append($value);
		$initiative.append($div);
		this['initiative'] = $value;
		this['initiative_name'] = $name;

		this.updInitiative(i);


	//--------------------------


	
	this.surge = {
		value : null,
		inDay : null
	}

	var $surge = $('<table />', {
		"class" : 'sheet_surges',
		"cellspacing" :"3"
	})
	$sheet.append($surge);

	for (var i in this.surge) {

		var $div = $('<tr />', {
			"class" : 'sheet_surge'
		})
		var $name = $('<td />', {
			"class" : 'sheet_surge_name'
		})
		var $value = $('<td />', {
			"class" : 'sheet_surge_value',
		})
		$div.append($name);
		$div.append($value);
		$surge.append($div);
		this.surge[i] = $value;
		this.surge[i+'_name'] = $name;

	}

	this.updSurge();

	//--------------------------

	this.$sheet = $sheet;
	//$('body').append($sheet);
}
CharSheet.prototype.updAbility = function(ability, value) {
	var value = value || this.character.ability[ability];
	this.$ability[ability].html(value);
	this.$ability[ability].attr('title',this.getInfoValueAbility(ability));

	this.$ability[ability+'_mod'].html(this.character.getAnyModPrint(this.character.getMod(ability, value)+ Math.floor(this.character.level / 2)));
	this.$ability[ability+'_mod'].attr('title',this.getInfoValueAbilityMod(ability));
}
CharSheet.prototype.getInfoValueAbility = function(ability) {
	var result = '';
	result += 'Стартовое значение: '+this.character.abilityStart[ability]+'\n';
	if (~this.character.raceAbility.indexOf(ability)) {
		result += 'Рассовый бонус: +2\n'
	}
	return result;
}
CharSheet.prototype.getInfoValueAbilityMod = function(ability) {
	var result = '';
	var abilityValue = this.character.ability[ability];
	result += 'Базовый модификатор ['+abilityValue+'] : '+Math.floor((abilityValue - 10) / 2)+'\n';
	result += 'Половина уровня ['+this.character.level+'] : '+Math.floor(this.character.level / 2)+'\n';
	return result;
}

CharSheet.prototype.updLevel = function() {
	this.$ability.LV.html(this.character.level);
}

CharSheet.prototype.updSkil = function(skillName) {
	var value = this.character.getSkillMod(skillName);
	this[skillName+'_name'].html(skillName);
	this[skillName+'_trained'].html(~this.character.feats.indexOf('trained_'+skillName) ? 'T' : '');
	this[skillName].html(this.character.getAnyModPrint(value));
	this[skillName].attr('title', this.getInfoValueSkill(skillName));
}
CharSheet.prototype.getInfoValueSkill = function(skillName) {
	var result = '';
	var ability = this.character.skillsList[skillName];
	var abilityValue = this.character.ability[ability];
	result += 'Базовый модификатор ['+abilityValue+'] : '+Math.floor((abilityValue - 10) / 2)+'\n';
	result += 'Половина уровня ['+this.character.level+'] : +'+Math.floor(this.character.level / 2)+'\n';
	if (~this.character.feats.indexOf('trained_'+skillName)) {
		result += 'Тренированный навык : +5\n' 
	}
	return result;
}

CharSheet.prototype.updAllSkil = function() {
	for (var i in this.character.skillsList) {
		this.updSkil(i)
	}
}

CharSheet.prototype.updInitiative = function() {
	var abilityValue = this.character.ability['DEX'];
	this['initiative'].html(this.character.getAnyModPrint(Math.floor((abilityValue - 10) / 2) + Math.floor(this.character.level / 2)));
	this['initiative'].attr('title', this.getInfoValueInitiative());
	this['initiative_name'].html('Initiative');
}

CharSheet.prototype.getInfoValueInitiative  = function() {
	var result = '';
	var abilityValue = this.character.ability['DEX'];
	result += 'Модификатор ловкости ['+abilityValue+'] : '+Math.floor((abilityValue - 10) / 2)+'\n';
	result += 'Половина уровня ['+this.character.level+'] : +'+Math.floor(this.character.level / 2)+'\n';
	return result;
}

CharSheet.prototype.updSurge = function() {
	this.surge.value.html(this.character.surge.value);
	this.surge.value.attr('title', '1/4 максимального значения');
	this.surge.value_name.html('value');


	this.surge.inDay.html(this.character.surge.inDay);
	this.surge.inDay.attr('title', this.getInfoValueSurgeValue());
	this.surge.inDay_name.html('inDay');

}
CharSheet.prototype.getInfoValueSurgeValue  = function() {
	var klass = this.character.klass;
	var result = 'Значение класса ['+Dict.classes[klass]+']: '+Classes[this.character.klass].surge+"\n";
	result += 'Модификатор телосложения ['+this.character.ability.CON+']: ' + this.character.getModPrint('CON');
	return result;
}


CharSheet.prototype.updHP = function() {
	this.HP.max.html(this.character.HP.max);
	this.HP.max.attr('title', this.getInfoValueHPmax());
	this.HP.max_name.html('max');

	this.HP.current.html(this.character.HP.current);
	this.HP.current_name.html('current');

	this.HP.blooded.html(this.character.HP.blooded);
	this.HP.blooded.attr('title', '1/2 максимального значения');
	this.HP.blooded_name.html('blooded');

}
CharSheet.prototype.getInfoValueHPmax  = function() {
	var result = '';
	var klass = this.character.klass;
	result += 'Первый уровень ['+Dict.classes[klass]+'] : '+Classes[klass].HP.firstLevel+'\n';
	result += 'Последующие уровни ['+Classes[klass].HP.otherLevel+"*"+(this.character.level - 1)+'] : '+(Classes[klass].HP.otherLevel * (this.character.level - 1))+'\n';

	return result;
}
/*-----------------------*/

CharSheet.prototype.namesOfTabs = ['powers', 'skills', 'inventory'];
CharSheet.prototype.namesOfPowerTabs = ['Base', 'Power', 'Utility'];
CharSheet.prototype.lastSelectedContent = CharSheet.prototype.namesOfTabs[0];

CharSheet.prototype.emptyBar = function() {
	this.$bar.empty();
}
CharSheet.prototype.addSelfToBar = function() {
	this.emptyBar();
	this.$bar.append(this.$tabs);
	this.$bar.append(this.$contents)
	this.$contentpowers.append(this.$defenses);
	this.$contentpowers.append(this.$HP);
	this.$contentpowers.append(this.$allPowers);
	this.$contentinventory.append(this.$inventory);
	this.selectTab(this.lastSelectedContent);
}
CharSheet.prototype.updAllDefenses = function() {
	this.updAC();
	this.updFORT();
	this.updWILL();
	this.updREF();
}

CharSheet.prototype.updAC = function() {
	this.$AC_name.html('КД');
	this.$AC_value.html(this.character.AC);
}
CharSheet.prototype.updFORT = function() {
	this.$FORT_name.html('Стойкость');
	this.$FORT_value.html(this.character.FORT);

}
CharSheet.prototype.updREF = function() {
	this.$REF_name.html('Реакция');
	this.$REF_value.html(this.character.REF);

}
CharSheet.prototype.updWILL = function() {
	this.$WILL_name.html('Воля');
	this.$WILL_value.html(this.character.WILL);

}

CharSheet.prototype.updAllHP = function() {
	this.updHPcurrent();
	this.updHPtemporary();
}
CharSheet.prototype.updHPcurrent = function() {
	this.$HPcurrent_value.html(this.character.HPcurrent+'/'+this.character.HPmax);
	this.$HPcurrent_name.html('Текущие хиты');
}
CharSheet.prototype.updHPtemporary = function() {
	if (this.character.HPtemporary  > 0 ) {
		this.$HPtemporary.show();
		this.$HPtemporary_value.html(this.character.HPtemporary);
		this.$HPtemporary_name.html("Временые хиты");
	}
	else {
		this.$HPtemporary.hide();
	}
}

CharSheet.prototype.selectTab = function(tab) {
	for (var i in this.namesOfTabs) {
		if (this.namesOfTabs[i] === tab) {
			this.lastSelectedContent = tab;
			this['$content'+this.namesOfTabs[i]].show();
		}
		else {
			this['$content'+this.namesOfTabs[i]].hide();	
		}
	}
}

CharSheet.prototype.selectPowerTab = function(tab) {
	for (var i in this.namesOfPowerTabs) {
		var name = this.namesOfPowerTabs[i];
		if (name === tab) {
			this['$powersContent'+name].show();
			this['$powersTab'+name].addClass('selected');
		}
		else {
			this['$powersContent'+name].hide();	
			this['$powersTab'+name].removeClass('selected');
		}
	}
}

CharSheet.prototype.updAllPowers = function() {
	this.updBasePowers();
	this.updPowerPowers();
	this.updUtilityPowers();
}
CharSheet.prototype.updBasePowers = function() {
	for (var i in this.character.powersBase) {
		var power = this.getPowerHTML(Powers[this.character.powersBase[i]]);
		this.getPowerPreviewHTML(Powers[this.character.powersBase[i]]);
		this.$powersContentBase.append(power);
	}
}
CharSheet.prototype.updPowerPowers = function() {
	this.$powersContentPower.html('Power');
}
CharSheet.prototype.updUtilityPowers = function() {
	this.$powersContentUtility.html('Utility');
}

CharSheet.prototype.getPowerHTML = function(power) {

	var args = {
		name : null,
		type : null,
		action : null,
		range : null,
		count : null
	}
	args.name = power.name;
	args.type = power.type;
	args.action = power.action;
	args.range = power.range;
	args.count = power.count;

	return this.getPowerPattern(args);
}
CharSheet.prototype.getPowerPreviewHTML = function(power) {

	var args = {
		name : null,
		type : null,
		action : null,
		range : null,
		count : null
	}
	args.id = power.name;
	args.name = power.name;
	args.type = power.type;
	args.action = power.action;
	args.range = power.range;
	args.count = power.count;
	args.flavor = power.flavor;
	args.keyWords = power.keyWords;
	args.attacks = power.attacks;

	return this.getPowerPreviewPattern(args);
}

CharSheet.prototype.getPowerPattern = function(data){

	var name = data.name || 'Name undefined';
	var type = data.type || 'At-Will';
	// var action = data.action || 'Standart def';
	// var range = data.range || 'Meele def'
	var count = data.count || 0

	var $result = $('<div />', {'class':'powerInList ' + type});

	var $name = $('<p />', {
		'class': 'powerInList_name',
		'text': name,
		'onclick' : "main.showPreviewPower('"+name+"')"
	});
	for (var i =1; i <= count; i++) {
		var $check = $('<div />', {'class':'powerInList_usage'});
		$name.append($check);
	}
	// var $range = $('<div />',{'class':'powerInList_range', 'text':range});
	// var $action = $('<div />',{'class':'powerInList_action', 'text':action});

	$result.append($name);
	// $result.append($range);
	// $result.append($action);

	this.powersList[name] = $result;
	return $result;
}
CharSheet.prototype.getPowerPreviewPattern = function(data){
	var $result = $('<div />', {'class':'powerPreview ' + data.type});

	var $name = $('<h4 />', {
		'class': 'powerPreview_name',
		'text': data.name
	});
	for (var i =1; i <= data.count; i++) {
		var $check = $('<div />', {'class':'powerInList_usage'});
		$name.append($check);
	}
	$result.append($name);

	if (data.hasOwnProperty('flavor')) {
		$result.append($('<div />', {
			'class': 'powerPreview_flavor',
			'text': data.flavor
		}));
	}
	if (data.hasOwnProperty('keyWords')) {
		$result.append($('<div />', {
			'class': 'powerPreview_keyWords',
			'text': data.keyWords
		}));
	}

	if (data.hasOwnProperty('attacks')) {
		for (var i in data.attacks) {
			var $table = $('<table />', {'class':'sheet_powerTable'});
			
			var $tr1 = $('<tr />', {});
			var $action = $('<td />', {'colspan':5, 'text':data.attacks[i].action});
			var $attack = $('<td />', {'colspan':2, 'rowspan':2, 'text': 'R', 'class' : 'sheet_powerTable_range'});
			var $range = $('<td />', {'colspan':8, 'text':data.attacks[i].range});
			$tr1.append($action);
			$tr1.append($attack);
			$tr1.append($range);
			$table.append($tr1)

			
			var $tr2 = $('<tr />', {});
			var $actionLabel = $('<td />', {
				'class': 'sheet_powerTable_label',
				'colspan': 5,
				'text': Dict.powerCard['action']
			});
			var $rangeLabel = $('<td />', {
				'class': 'sheet_powerTable_label',
				'colspan': 8,
				'text': Dict.powerCard['range']
			});
			$tr2.append($actionLabel);
			$tr2.append($rangeLabel);
			$table.append($tr2)


			
			var $tr3 = $('<tr />', {});
			var $ability = $('<td />', {
				'colspan': 3,
				'text': data.attacks[i].ability
			});
			var $vs = $('<td />', {
				'colspan': 1,
				'text': 'пр.',
				'class': 'sheet_powerTable_vs'
			});
			var $defense = $('<td />', {
				'colspan': 3,
				'class': 'sheet_powerTable_defense',
				'text': data.attacks[i].defense
			});
			var $target = $('<td />', {
				'colspan': 8,
				'text': data.attacks[i].target
			});
			$tr3.append($ability);
			$tr3.append($vs);
			$tr3.append($defense);
			$tr3.append($target);
			$table.append($tr3)

			
			var $tr4 = $('<tr />', {});
			var $abilityLabel = $('<td />', {
				'class': 'sheet_powerTable_label',
				'colspan': 3,
				'text': Dict.powerCard['attack']
			});
			var $vsLabel = $('<td />', {
				'class': 'sheet_powerTable_label',
				'colspan': 1,
				'text': '/'
			});
			var $defenseLabel = $('<td />', {
				'class': 'sheet_powerTable_label sheet_powerTable_defense',
				'colspan': 3,
				'text': Dict.powerCard['defense']
			});
			var $targetLabel = $('<td />', {
				'class': 'sheet_powerTable_label',
				'colspan': 8,
				'text': Dict.powerCard['target']
			});
			$tr4.append($abilityLabel);
			$tr4.append($vsLabel);
			$tr4.append($defenseLabel);
			$tr4.append($targetLabel);
			$table.append($tr4)


			$result.append($table);

			for (var j in data.attacks[i].effect) {
				for (var k in data.attacks[i].effect[j].text) {
				var effect = data.attacks[i].effect[j].text[k];
					$effect = $('<p />', {'class': 'powerPreview_p', 'text':effect.text})
					console.log(effect.text)
					if (effect.hasOwnProperty('bold')) {
						$effect.prepend($('<b />',{'text':effect.bold+' '}))
					}
					$result.append($effect);	
				}			
			}
			var $use = $('<p />', {'class':'powerPreview_p'})
			$use.append($('<span />', {
				'class': 'powerPreview_act',
				'text': 'use',
				'onclick': "main.usePower('"+data.id+"')"
			}))
		}
		$result.append($use);

	}
	this.powersPreview[data.name] = $result;
	return $result;
}
CharSheet.prototype.$glob_second_bar = $('#glob_second_bar');
CharSheet.prototype.showPreviewPower = function(name) {
	this.$glob_second_bar.empty();
	if (name) {
		this.$glob_second_bar.append(this.powersPreview[name]);
	}
}
CharSheet.prototype.selectPower = function (name) {
	this.showPreviewPower(name);
}

CharSheet.prototype.updEquiped = function() {
	this.$equiped.empty();
	var arr = this.character.slotList;
	for (var i in arr) {
		if (this.character.equiped.hasOwnProperty(arr[i])) {
			var slotname = Dict.itemSlot[arr[i]];
			var slot = $('<div />', {
				'class': 'sheet_inventory_slot',
				'onclick' : "main.showPreviewItem('"+this.character.equiped[arr[i]]+"')"

			});
			var name = $('<div />', {'class': 'sheet_inventory_slot_name','text':slotname});
			var item = $('<div />', {'class': 'sheet_inventory_slot_item','text':this.character.equiped[arr[i]]});

			if (Items[this.character.equiped[arr[i]]].hasOwnProperty('magic')) {
				item.addClass('magic');
			}

			slot.append(name);
			slot.append(item);
			this.$equiped.append(slot);
		}
	}
	var count = 0;
	var $table = $('<table />', {'class':'sheet_inventory_items'});


	var arrItems = this.character.items; 
	for (var i in arrItems) {
		count++;
		console.log(i)
		$tr = $('<tr />', {
			'class': 'sheet_inventory_item',
			'onclick': "main.showPreviewItem('" + i + "')"
		});

		if (Items[i].hasOwnProperty('magic')) {
			$tr.addClass('magic');
		}

		$name = $('<td />', {'class':'sheet_inventory_item_name', 'text':i});
		$weight = $('<td />', {'class':'sheet_inventory_item_weight', 'text':Items[i].weight});
		$count = $('<td />', {'class':'sheet_inventory_item_count', 'text':arrItems[i].count});

		$tr.append($name);
		$tr.append($weight);
		$tr.append($count);

		$table.append($tr);
	}
	if (count) {
		var slot = $('<div />', {'class': 'sheet_inventory_slot'});
		var name = $('<div />', {'class': 'sheet_inventory_slot_name','text':'Inventory'});
		slot.append(name);
		slot.append($table);
		this.$equiped.append(slot);
	}

}

CharSheet.prototype.selectItem = function(name) {
	this.$glob_second_bar.empty();
	console.log(name)
	if (name) {
		if (Items.hasOwnProperty(name)) {

			var item = Items[name];
			console.log(item)
			var $item = $('<div />', {'class' : 'itemPreview'});
			if (item.hasOwnProperty('magic')) {
				$item.addClass('magic');
			}
			$h = $('<h4 />',{'class':'itemPreview_name', 'text' : item.name || name});
			$item.append($h);
			this.$glob_second_bar.append($item);
		}
		else {

			var $item = $('<div />', {'class' : 'itemPreview'});
			if (item.hasOwnProperty('magic')) {
				$item.addClass('magic');
			}
			$h = $('<h4 />',{'class':'itemPreview_name', 'text' : 'No Info'});
			$item.append($h);
			this.$glob_second_bar.append($item);
		}

	}
}