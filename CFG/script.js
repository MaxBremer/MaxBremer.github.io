//Allow use of tab within textareas, instead of entering next input.
var textareas = document.getElementsByTagName("textarea");
var count = textareas.length;
for(var i=0;i<count;i++){
    textareas[i].onkeydown = function(e){
        if(e.keyCode==9 || e.which==9){
        	console.log("TABBED");
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            this.selectionEnd = s+1; 
        }
    }
    textareas[i].style.height = "";
    textareas[i].style.height = textareas[i].scrollHeight + "px";
    var lines = textareas[i].value.split(/(\r\n|\n|\r)/gm);
    var max = 3;
    for (var j = 0; j < lines.length; j++) {
    	max = Math.max(lines[j].length, max);
    }
    textareas[i].style.width = "";
    textareas[i].style.width = (max * 8) + "px";
}


document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    let buffer = [];
    let count = 0;
    const seq = "dylanisanasshole"
    const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase();
        if (charList.indexOf(key) === -1) return;
        if (seq.charAt(count)==key) {
            count += 1;
            //console.log(count);
            buffer.push(key);
            if (count==seq.length) {
                document.getElementById("cfg").value = '*S - *MaxInsult; *MaxInsult - "<insult>"; *insult - "Max is <meanword.a>." | "Max can get <meanverb>." | "Hey Max, go <phallicverb> a <phallicobject>." | "Max, go and <action> in a <badplace>."; *meanword - "asshole" | "dickhead" | "champion masturbator" | "cocktease" | "rude dude with an attitude" | "weenie"; *meanverb - "fucked" | "shafted" | "defenestrated" | "lovingly caressed" | "vored"; *phallicverb - "suck" | "lick" | "gnaw on" | "gargle"; *phallicobject - "peen" | "dildo" | "eggplant" | "clit" | "ten-foot pole"; *action - "die" | "fall" | "drown" | "suffocate"; *badplace - "hole" | "well" | "anus" | "tar pit";';
                count = 0;
            }
        }
        
    });
});
function townGen(){
	var tArea = document.getElementById("cfg");
	var entry = '*S - *Settlement;*Settlement - "<name.cap>: <city_desc>";*desc - *city_desc | *town_desc | *camp_desc;*city_desc - "<city_size.a.cap> <city_word> in the <compass> of <region><possibleTrait>" | "This <city_size.ff> <city_word> is known for <trait>." | "<compass.a.cap>ern <city_word> well-known for <trait>." | "<city_size.a.cap> <compass>ern <city_word> with <reason.a>ly-incentivized tendency towards <trait>." | "The most defining trait of this <city_size.ff> <city_word> is <trait>." | "Though this <city_word> is famous for <trait>, it also secretly harbors <trait>.";*town_desc - "a";*camp_desc - "a";*possibleTrait - "." | " with <trait>.";*name - "<beg><mid><end>" | "<beg><mid><end>" | "<mid><end>" | "<mid><end>" | "<beg><mid>" | *mid;*beg - "a" | "be" | "de" | "el" | "fa" | "jo" | "ki" | "la" | "ma" | "na" | "o" | "pa" | "re" | "se" | "ta" | "va";*mid - "bar" | "ched" | "dell" | "far" | "gran" | "hal" | "jen" | "kel" | "lim" | "mor" | "net" | "penn" | "quil" | "rond" | "sark" | "shen" | "tur" | "vash" | "yor" | "zen";*end - "a" | "ac" | "ai" | "al" | "am" | "an" | "ar" | "ea" | "el" | "er" | "ess" | "ett" | "ic" | "id" | "il" | "in" | "is" | "or" | "us";*city_word - "<city_type> <city>" | *city;*city_type - "trade" | "militant" | "academic" | "farming" | "mining" | "religious" | "tourist trap" | "industrial";*city - "city" | "city" | "metropolis" | "urban nexus" | "urban center" ;*city_size - *l_size | *m_size | *l_size | *m_size |*other_size;*town_size - *s_size | *m_size | *s_size | *m_size |*other_size;*camp_size - *s_size | *s_size | *other_size;*trait - *plus | *minus | *plus | *minus | "<trait> and <trait>";*plus - "<plentiful> <good>" | "<plentiful> <work>" | "<strong> <magic.s>" | "<posP.a> <noble>" | "<posP> <noble.s>" | "<posP> <townsfolk.s>" | "<posP.a> <townsfolk>" | "<posB.a> <building>" | "<posB> <building.s>" | "<low> <monster> attacks";*minus - "<low> <wealth>" | "<weak> <magic.s>" | "<low> <work>" | "<negP> <townsfolk.s>" "<negP.a> <townsfolk>" | "<negP.a> <noble>" | "<negP> <noble.s>" | "<negB.a> <building>" | "<negP> <noble.s>";/Nouns.;*monster - "goblin";*work - "work" | "trade" | "employment" | "opportunity";*wealth - "wealth" | "coin" | "gold" | "trade" | "success";*good - "fabric" | "enchanted items" | "maps" | "stone" | "wood" | "fish" | "fur" | "livestock" | "metal" | "tools" | "weapons";*magic - "magick" | "spell" | "leyline" | "enchantment";*townsfolk - "trader" | "hunter" | "smith" | "chef" | "adventurer" | "prostitute" | "servant" | "governer" | "enchanter" | "armorer" | "weaponsmith" | "farmer" | "guard";*noble - "noble" | "governor" | "mogul" | "prince" | "princess" | "mayor";*building - "church" | "house" | "governance center" | "forge" | "farmhouse" | "shop" | "inn" | "mansion" | "boathouse" | "<adventurer>\'s tower" | "wall" | "granary" | "<shopowner>\'s shop";*shopowner - "blacksmith" | "carpenter" | "potter" | "tailor" | "material vendor" | "glassblower" | "leatherworker";*adventurer - "ranger" | "wizard" | "sorcerer" | "warlock" | "druid" | "guard" | "scholar"; *reason - "magical" | "technological" | "economical" | "political";*region - "Amastacia" | "Ghyssa" | "Terranea Xanthunae" | "Krylamarsh" | "Frozen Coast" | "Desola" | "Kvor\'la coast";/Adjectives.;*plentiful - "plentiful" | "abundant" | "nigh-unlimited" | "generous" | "extravagant" | "copious";*strong - "strong" | "powerful" | "potent" | "dominant" | "impressive" | "vigorous";*posP - "kind" | "good-aligned" | "generous" | "well-spoken" | "charismatic" | "intelligent" | "shrewd" | "loving" | "creative" | "artistic" | "friendly" | "honest" | "charitable" | "logical" | "whimsical" | "responsible" | "honorable" | "fair" | "gorgeous" | "self-aware";*posB - "well-constructed" | "gorgeous" | "well-maintained" | "creatively-designed" | "sturdy" | "artful" | "efficient" | "historical";*low - "low" | "little" | "scant" | "meager" | "limited" | "insufficient" | "only slight";*weak - "weak" | "fragile" | "feeble" | "sluggish" | "unsteady" | "weakened" | "flimsy" | "wavering";*negP - *weak | "selfish" | "vicious" | "vengeful" | "evil-aligned" | "irate" | "quick-to-anger" | "strictly by-the-books" | "traitorous" | "uncaring" | "apathetic" | "inconsiderate" | "violent";*negB - "creepy" | "derelict" | "abandoned" | "dangerous" | "infested" | "crumbling" | "crime-filled" | "ugly" | "dangerous";*s_size - "small" | "tiny" | "small-scale" | "low-population" | "low-slung" | "piddling" | "modest" | "little" | "adorable little";*m_size - "moderate" | "medium-sized" | "sizable" | "significant" | "average-sized" | "ordinary" | "standard";*l_size - "large" | "huge" | "enormous" | "gigantic" | "massive" | "populous" | "immense" | "sweeping" | "immense" | "extensive" | "considerable";*other_size - "sprawling" | "spread-out" | "misshapen" | "twisted" | "contorted";/Appendix;*compass - "north" | "south" | "east" | "west";';
	tArea.value = "";
	for (var i = 0; i < entry.length; i++) {
		var c = entry.charAt(i);
		if(c==";"){
			tArea.value += c + "\n";
		}else{
			tArea.value += c;
		}	
	}
}

function clearOutput(){
	var oArea = document.getElementById("output");
	oArea.innerHTML = "";
}