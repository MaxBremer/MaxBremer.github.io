//FORBIDDEN CHARS FOR SYMBOL NAMES: -.<>

//MAIN function, runs the whole process, called when "WRITE" button is pressed.
function readInp(){
	var inp = document.getElementById("cfg").value;
	var without = interpret(inp);
	var SymSet = new SymbolSet(without);
	var startSym = SymSet.findSym("S");
	var sentence = SymSet.writeSymbol(startSym);
	//console.log(sentence);
	document.getElementById("output").innerHTML += "<li>" + sentence + "</li>";
}

function weightedChoice(options, chances){
	if(!(options.length == chances.length)){
		throw "ERROR: OptLength /= ChanceLength"
	}
	var summed = 0;
	for(var i in chances){
		summed += i;
	}

	var num = Math.floor(Math.random() * summed);
	var tSum = 0
	for(var j = 0; j < options.length; j++){
		tSum += chances[j];
		if(num <= tSum){
			return options[j]
		}
	}


}
//The class to hold the set of all symbols for reference.
class SymbolSet{
	//Constructor takes a symbol list. Currently, it needs to be assembled beforehand.
	constructor(inpSymList){
		this.syms = inpSymList
		if(this.findSym("S") == null){
			throw "ERROR: Symbol list does not contain start symbol 'S'."
		}
	}
	//A method built for print/debugging.
	toString(){
		var returner = "";
		for (var i = 0; i < this.syms.length; i++) {
			returner += this.syms[i].toString() + "\n";
		}
		return returner;
	}
	//The following are a pair of pseudo-recursive methods that reference both themselves and
	//each other in order to fully write out a given symbol that's inpupt.
	//The whole process is started by a call to writeSymbol() that passes in *S
	writeSymbol(s){
		var choice = "undef";
		if (!s.weightOpts) {
			choice = s.opts[Math.floor(Math.random() * s.opts.length)];
		}else{
			choice = weightedChoice(s.opts, s.weightList);
		}
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
		var modString = "";
		//The current full set of possible modes for the following state machine.
		const mode = {
			TEXT: 'text',
			REFERENCE: 'ref',
			MODIFIER: 'mod'
		}
		var curMode = mode.TEXT;
		//One of two token-by-token state machines, the other being the one that actually interprets the raw text input.
		//Terminals/"STRs" are stored as the raw text within the quotation marks that are originally input, as they're kind of another 
		//"mini-language" in and of themselves.
		for (var i = 0; i < choice.length; i++) {
			var c = choice.charAt(i);
			switch(curMode){
				//This mode assumes raw text input, no processing whatsoever.
				case mode.TEXT:
				//Several of these inner switch statements exist purely so that I can add more options/features in the future.
				//Such as this one.
				switch(c){
					case '<':
					curMode = mode.REFERENCE;
					break;
					default:
					returner += c;
				}
				break;
				//In this mode, we're within an inner symbol reference. Thus, we watch for it ending (">") and for a modifier-start (".").
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
				//Very similar to reference mode in that we're watching for reference-end OR the start of a new symbol.
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
	//A bad, inefficient way to find a symbol in our symbol list. I'll improve this later. Right now, its computational efficiency is not really a priority.
	//TODO: a better approach to storing/referencing symbols. 
	findSym(symStr){
		for (var i = this.syms.length - 1; i >= 0; i--) {
			if(this.syms[i].sym == symStr){
				return this.syms[i];
			}
		}
		prompt("ERROR: UNDEFINED SYMBOL " + symStr + "REFERENCED.");
		throw "COULD NOT FIND SYMBOL " + symStr;
		return null;
	}
	//The function for applying a discovered modifier to the string in question.
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
			//Just the opposite of the capitalization mod, make the first letter letter.
			return str.charAt(0).toLowerCase() + str.substring(1);
			break;
			default:
			throw "ERROR: INVALID MODIFIER " + mod;
		}
	}
}
//A simple class to store a symbol and all relevant text to that symbol, basically just a replacement for a list.
class Symbol{
	constructor(){
		this.sym = "";
		this.opts = [];
		this.weightOpts = false;
	}
	setSym(sym){
		this.sym = sym;
	}
	addOpt(opt){
		this.opts.push(opt);
	}
	enableWeights(wL){
		this.weightOpts = true;
		this.weightList = wL;
	}
	toString(){
		var optList = "";
		for (var i = 0; i < this.opts.length; i++) {
			if(this.opts[i] instanceof Symbol){
				console.log("weirdo");
				optList += this.opts[i].sym;
			}else{
				optList += this.opts[i];
			}
			optList += " | ";
		}
		return this.sym + " - " + optList;
	}
}
//A custom whitespace removal that doesn't remove whitespace within quotation-marks.
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
	//Second state machine, this one actually being the full-on interpreter. 
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
						symList[symInd].addOpt('<' + curString + '>');
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
						symList[symInd].addOpt('<' + curString + '>');
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
	return symList;
}
