//FORBIDDEN CHARS FOR SYMBOL NAMES: -.<>
function readInp(){
	var inp = document.getElementById("cfg").value;
	var without = interpret(inp);
	var SymSet = new SymbolSet(without);
	var startSym = SymSet.findSym("S");
	var sentence = SymSet.writeSymbol(startSym);
	//console.log(sentence);
	document.getElementById("output").innerHTML += "<li>" + sentence + "</li>";
}
class SymbolSet{
	constructor(inpSymList){
		this.mods = {
			CAPITALIZE: "cap",
			PLURALIZE: "plur"
		}
		if(findSymList(inpSymList, "S") == null){
			throw "ERROR: Symbol list does not contain start symbol 'S'."
		}
		this.syms = [];
		for (var i = 0; i < inpSymList.length; i++) {
			this.syms.push(inpSymList[i]);
		}
	}
	toString(){
		var returner = "";
		for (var i = 0; i < this.syms.length; i++) {
			returner += this.syms[i].toString() + "\n";
		}
		return returner;
	}
	writeSymbol(s){
		var choice = s.opts[Math.floor(Math.random() * s.opts.length)];
		if(choice instanceof Symbol){
			return this.writeSymbol(choice);
		}else if(typeof choice == "string"){
			return this.writeStr(choice);
		}else{
			throw "INVALID CHOICE TYPE " + typeof choice;
		}
	}
	writeStr(choice){
		var returner = "";
		var curString = "";
		var modString = ""
		const mode = {
			TEXT: 'text',
			REFERENCE: 'ref',
			MODIFIER: 'mod'
		}
		var curMode = mode.TEXT;
		for (var i = 0; i < choice.length; i++) {
			var c = choice.charAt(i);
			// if(c == '<' && !isRef){
			// 	isRef = true;
			// }else if(c == '>' && isRef){
			// 	isRef = false;
			// 	returner += this.writeSymbol(this.findSym(symRef));
			// 	symRef = "";
			// }else if(isRef){
			// 	symRef += c;
			// }else{
			// 	returner += c;
			// }
			switch(curMode){
				case mode.TEXT:
				switch(c){
					case '<':
					curMode = mode.REFERENCE;
					break;
					default:
					returner += c;
				}
				break;
				case mode.REFERENCE:
				switch(c){
					case '>':
					curMode = mode.TEXT;
					returner += this.writeSymbol(this.findSym(curString));
					curString = ""
					break;
					case '.':
					curMode = mode.MODIFIER;
					modString = this.writeSymbol(this.findSym(curString));
					curString = "";
					break;
					default:
					curString += c;
				}
				break;
				case mode.MODIFIER:
				switch(c){
					case '>':
					curMode = mode.TEXT;
					returner += this.modify(modString, curString);
					curString = "";
					break;
					case '.':
					modString = this.modify(modString, curString);
					curString = "";
					break;
					default:
					curString += c;
				}
				default:
			}
		}
		return returner;
	}
	findSym(symStr){
		for (var i = this.syms.length - 1; i >= 0; i--) {
			if(this.syms[i].sym == symStr){
				return this.syms[i];
			}
		}
		prompt("ERROR: UNDEFINED SYMBOL " + symStr + "REFERENCED.");
		throw "COULD NOT FIND SYMBOL " + symStr;
	}
	modify(str, mod){
		var vowels = ['a', 'e', 'i', 'o', 'u', 'y']
		switch(mod){
			case "cap":
			//This modification simply capitalizes the string.
			return str.charAt(0).toUpperCase() + str.substring(1);
			break;
			case "capAll":
			return str.toUpperCase();
			case "a":
			//this modification adds the correct a/an to the string, assumes noun input.
			if (vowels.includes(str.charAt(0).toLowerCase()) || (vowels.includes(str.charAt(1).toLowerCase()) && str.charAt(1) != "u" && str.charAt(0) == 'h')){
				return "an " + str;
			}else{
				return "a " + str;
			}
			break;
			case "ed":
			//WIP: Convert verb to past tense.
			//NOTE: This assumes input of simple present singular form, and only does simple past tense.
			//This is also only the affirmative.
			return str + "ed";
			break;
			case "s":
			var es_single_cases = ['s', 'x', 'z'];
			var es_double_cases = ['ch', 'sh', 'ss'];
			var irregulars = ['woman','man','child','tooth','foot','person','leaf','mouse','goose','half','knife','wife','life','elf','loaf','potato','tomato','cactus','focus','fungus','nucleus','syllabus','analysis','diagnosis','oasis','thesis','crisis','phenomenon','criterion','datum'];
			var irregulars_pl = ['women','men','children','teeth','feet','people','leaves','mice','geese','halves','knives','wives','lives','elves','loaves','potatoes','tomatoes','cacti','foci','fungi','nuclei','syllabi','analyses','diagnoses','oases','theses','crises','phenomena','criteria','data'];
			var nonconverts = ['sheep','fish','deer','species','aircraft'];
			if(irregulars.includes(str)){
				return irregulars_pl[irregulars.indexOf(str)];
			}else if(nonconverts.includes(str)){
				return str;
			}else if(str.charAt(-1) == "y" && !vowels.includes(str.charAt(-1))){
				return str.substring(0, str.length - 1) + "ies";
			}else if(es_single_cases.includes(str.charAt(-1)) || es_double_cases.includes(str.substring(str.length - 2))){
				return str + "es";
			}else{
				return str + "s";
			}
			break;
			case "ff":
			//Fifty-fifty chance of the modified string being included at all
			if(Math.random() > 0.5){
				return str;
			}else{
				return "";
			}
			break;
			case "uncap":
			return str.charAt(0).toLowerCase() + str.substring(1);
			break;
			default:
			throw "ERROR: INVALID MODIFIER " + mod;
		}
	}
}
class Symbol{
	constructor(){
		this.sym = "";
		this.opts = [];
	}
	setSym(sym){
		this.sym = sym;
	}
	addOpt(opt){
		this.opts.push(opt);
	}
	toString(){
		var optList = "";
		for (var i = 0; i < this.opts.length; i++) {
			if(this.opts[i] instanceof Symbol){
				optList += this.opts[i].sym;
			}else{
				optList += this.opts[i];
			}
			optList += " | ";
		}
		return this.sym + " - " + optList;
	}
}
function findSymList(symList, s){
	for (var i = symList.length - 1; i >= 0; i--) {
		if(symList[i].sym == s){
			return symList[i];
		}
	}
	console.log("SYMBOL NOT FOUND");
	return null;
}
function customWSRemove(val){
	var isQuote = false;
	var output = "";
	for (var i = 0; i < val.length; i++) {
		var ch = val.charAt(i);
		if (ch=='"') {
			isQuote = !isQuote;
			output = output + ch;
		}else if (/\s/.test(ch)) {
			isQuote ? output = output + ch : output = output;
		} else {
			output = output + ch;
		}
	}
	return output;
}
function interpret(str){
	str = customWSRemove(str);
	const mode = {
		TERMINAL: 'terminal',
		SYMBOL_INST: 'symbol instantiation',
		SYMBOL_REF: 'symbol referencing',
		MID_SYM: 'currently defining symbol',
		COMMENT: 'comment',
		NONE: 'none'
	}
	var startExists = false;
	if (str.charAt(0) != "*"){
		throw "ERROR: Please start by defining a symbol";
	}
	var curMode = mode.NONE;
	var curString = "";
	var symList = [];
	var symInd = 0;
	for(var i = 0; i < str.length; i++){
		var c = str.charAt(i);
		if (curMode == mode.TERMINAL && c != '"') {
			curString += c;
		}else{
			if (curMode != mode.COMMENT || c == ";") {
				switch(c){
					case '*':
					if(curMode == mode.NONE){
						curMode = mode.SYMBOL_INST;
					}else if(curMode == mode.MID_SYM){
						curMode = mode.SYMBOL_REF;
					}else{
						throw "INVALID * AT " + i;
					}
					break;
					case '-':
					if (curMode == mode.SYMBOL_INST) {
						var temp = new Symbol();
						temp.setSym(curString);
						symList.push(temp);
						curString = "";
						curMode = mode.MID_SYM;
					}else{
						throw "INVALID - AT " + i + " curString is " + curString + " mode is " + curMode;
					}
					break;
					case '"':
					if (curMode == mode.MID_SYM) {
						curMode = mode.TERMINAL;
					}else if(curMode == mode.TERMINAL){
						if (curString.charAt(0) == "*") {
							throw "ERROR: Terminal options can't start with *";
						}
						symList[symInd].addOpt(curString);
						curString = "";
						curMode = mode.MID_SYM;
					}else{
						throw 'INVALID " AT ' + i;
					}
					break;
					case ';':
					if(curMode == mode.NONE){
						throw "DOUBLE ; ERROR AT " + i;
					}else if(curMode == mode.SYMBOL_REF){
						var refSym = '*' + curString;
						symList[symInd].addOpt(refSym);
						curString = "";
						symInd += 1;
						curMode = mode.NONE;
					}else if(curMode == mode.TERMINAL){
						throw "ENDED LINE IN MID-TERMINAL; Likely caused by missing quotation mark."
					}else{
						if(curMode != mode.COMMENT){
							symInd += 1;
						}
						curMode = mode.NONE;
					}
					break;
					case '|':
					if (curMode == mode.SYMBOL_REF) {
						var refSym = '*' + curString;
						symList[symInd].addOpt(refSym);
						curString = "";
						curMode = mode.MID_SYM;
					}else if(curMode != mode.MID_SYM){
						throw "INVALID | AT " + i;
					}
					break;
					case '/':
					if (curMode == mode.NONE) {
						curMode = mode.COMMENT;
					}else{
						curString += c;
					}
					break;
					default:
					curString += c;
				}
			}
		}
	}
	for (var i = 0; i < symList.length; i++) {
		for (var j = 0; j < symList[i].opts.length; j++) {
			if(symList[i].opts[j].charAt(0) == '*'){
				var possibleSym = findSymList(symList, symList[i].opts[j].substring(1));
				if(possibleSym != null){
					symList[i].opts[j] = possibleSym;
				}else{
					throw "ERROR: REFERENCED SYMBOL " + symList[i].opts[j].substring(1) + " NOT FOUND.";
				}
			}
		}
	}
	return symList;
}
