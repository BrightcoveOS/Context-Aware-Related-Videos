/**
 * Brightcove Context Aware Related Videos 1.0.1 (18 FEBRUARY 2011)
 *
 * REFERENCES:
 *	 Website: http://opensource.brightcove.com
 *	 Source: http://github.com/brightcoveos
 *
 * AUTHORS:
 *	 Brandon Aaskov <baaskov@brightcove.com>
 *	 Matthew Congrove <mcongrove@brightcove.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the “Software”),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, alter, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the following conditions:
 *   
 * 1. The permission granted herein does not extend to commercial use of
 * the Software by entities primarily engaged in providing online video and
 * related services.
 *  
 * 2. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT ANY WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, SUITABILITY, TITLE,
 * NONINFRINGEMENT, OR THAT THE SOFTWARE WILL BE ERROR FREE. IN NO EVENT
 * SHALL THE AUTHORS, CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY WHATSOEVER, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE, INABILITY TO USE, OR OTHER DEALINGS IN THE SOFTWARE.
 *  
 * 3. NONE OF THE AUTHORS, CONTRIBUTORS, NOR BRIGHTCOVE SHALL BE RESPONSIBLE
 * IN ANY MANNER FOR USE OF THE SOFTWARE.  THE SOFTWARE IS PROVIDED FOR YOUR
 * CONVENIENCE AND ANY USE IS SOLELY AT YOUR OWN RISK.  NO MAINTENANCE AND/OR
 * SUPPORT OF ANY KIND IS PROVIDED FOR THE SOFTWARE.
 */

var BCContextAware = new function () {
	this.init = function (pParameters) {
		this.callback = typeof pParameters.callback != "undefined" ? pParameters.callback : false;
		this.element = typeof pParameters.content != "undefined" ? pParameters.content : false;
		this.returnCount = typeof pParameters.videos != "undefined" ? pParameters.videos : 5;
		this.termCount = typeof pParameters.terms != "undefined" ? pParameters.terms : 5;
		this.token = typeof pParameters.token != "undefined" ? pParameters.token : false;
		this.validTags = typeof pParameters.tags != "undefined" ? pParameters.tags : ["p", "title", "h1", "h2", "h3", "h4", "h5", "h6"];
		
		if(this.callback == false) {
			this.error("BCContextAware: Could not complete request [001]");
			
			return;
		}
		
		if(this.token == false) {
			this.error("BCContextAware: Could not complete request [002]");
			
			return;
		}
		
		var tagContents = [];
		var parent = this.element ? document.getElementById(this.element) : document.getElementsByTagName("body")[0];
		
		if(typeof parent == "undefined") {
			this.error("BCContextAware: Content element not available [003]");
			
			return;
		}
		
		for(var i = 0; i < this.validTags.length; i++) {
			var tags = parent.getElementsByTagName(this.validTags[i]);
			
			if(typeof tags[0] != "undefined") {
				for(var q = 0; q < tags.length; q++) {
					var item = tags[q];
					
					if(item) {
						var words = item.innerHTML.replace(/[.,!?:;'"-\)\(]+/g, "").replace(/<[a-zA-Z0-9=#-_\s"'\/\.][^>]*>/ig, "").split(" ");
						
						for(var z = 0 ; z < words.length; z++) {
							if(words[z].length > 2) {
								tagContents.push(words[z].toLowerCase());
							}
						}
					}
				}
			}
		}
		
		var wordsCounted = [];
		
		for(var k = 0 ; k < tagContents.length; k++) {
			var wordToCheck = tagContents[k];
			var wordFound = false;
			
			for(var j = 0; j < wordsCounted.length; j++) {
				if(wordsCounted[j].word == wordToCheck) {
					wordsCounted[j].count += 1;
					
					wordFound = true;
					break;
				}
			}
			
			if(!wordFound) {
				var wordToStore = {
					word: this.trim(wordToCheck),
					count: 1
				};
				
				wordsCounted.push(wordToStore);
			}
		}
		
		var stopWords = ["a", "able", "about", "above", "according", "accordingly", "across", "actually", "adj", "after", "afterwards", "again", "against", "ago", "ahead", "ain't", "all", "allow", "allows", "almost", "alone", "along", "alongside", "already", "also", "although", "always", "am", "amid", "amidst", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "back", "backward", "backwards", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "came", "can", "cannot", "cant", "can't", "caption", "cause", "causes", "certain", "certainly", "changes", "clearly", "c'mon", "co", "co.", "com", "come", "comes", "completely", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "c's", "currently", "dare", "daren't", "decrease", "decreasingly", "definitely", "described", "despite", "did", "didn't", "different", "directly", "do", "does", "doesn't", "doing", "done", "don't", "down", "downwards", "during", "each", "eg", "eight", "eighty", "either", "else", "elsewhere", "end", "ending", "enough", "entirely", "especially", "et", "etc", "even", "ever", "evermore", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "fairly", "far", "farther", "few", "fewer", "fifth", "first", "firstly", "five", "followed", "following", "follows", "for", "forever", "former", "formerly", "forth", "forward", "found", "four", "from", "further", "furthermore", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got", "gotten", "greetings", "had", "hadn't", "half", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "here's", "hereupon", "hers", "herself", "he's", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "hundred", "i", "i'd", "ie", "if", "ignored", "i'll", "i'm", "immediate", "in", "inasmuch", "inc", "increase", "increasingly", "indeed", "indicate", "indicated", "indicates", "inner", "inside", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "its", "it's", "itself", "i've", "just", "keep", "keeps", "kept", "know", "known", "knows", "last", "lastly", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "likewise", "little", "look", "looking", "looks", "low", "lower", "ltd", "made", "main", "mainly", "make", "makes", "many", "may", "maybe", "mayn't", "me", "mean", "meantime", "meanwhile", "merely", "might", "mightn't", "mine", "minus", "miss", "more", "moreover", "most", "mostly", "mr", "mrs", "ms", "much", "must", "mustn't", "my", "myself", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needn't", "needs", "neither", "never", "never", "neverless", "nevertheless", "new", "next", "nine", "ninety", "no", "nobody", "non", "none", "nonetheless", "noone", "no-one", "nor", "normally", "not", "nothing", "notwithstanding", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "one's", "only", "onto", "opposite", "or", "other", "others", "otherwise", "ought", "oughtn't", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "particular", "particularly", "past", "per", "perfectly", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provided", "provides", "que", "quick", "quickly", "quite", "qv", "rather", "rd", "re", "really", "reasonably", "recent", "recently", "regarding", "regardless", "regards", "relatively", "respectively", "right", "round", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "since", "six", "so", "some", "somebody", "someday", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "surely", "take", "taken", "taking", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "there'd", "therefore", "therein", "there'll", "there're", "theres", "there's", "thereupon", "there've", "these", "they", "they'd", "they'll", "they're", "they've", "thing", "things", "think", "third", "thirty", "this", "thorough", "thoroughly", "those", "though", "three", "thrice", "through", "throughout", "thru", "thus", "thusly", "till", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "t's", "twice", "two", "un", "under", "underneath", "undoing", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "up", "upon", "upwards", "us", "use", "used", "useful", "uses", "using", "usually", "utterly", "value", "various", "versus", "very", "via", "viz", "vs", "want", "wants", "was", "wasn't", "way", "we", "we'd", "welcome", "well", "we'll", "went", "were", "we're", "weren't", "we've", "what", "whatever", "what'll", "what's", "what've", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "where's", "whereupon", "wherever", "whether", "which", "whichever", "while", "whilst", "whither", "who", "who'd", "whoever", "whole", "wholly", "who'll", "whom", "whomever", "who's", "whose", "why", "will", "willing", "wish", "with", "within", "without", "wonder", "wondered", "wondering", "won't", "worst", "would", "wouldn't", "yes", "yet", "you", "you'd", "you'll", "your", "you're", "yours", "yourself", "yourselves", "you've", "zero"];
		
		for(var s = wordsCounted.length; s > 0; s--) {
			if(stopWords.indexOf(wordsCounted[s - 1].word) > -1) {
				wordsCounted.splice(s - 1, 1);
			}
		}
			
		wordsCounted.sort(function (pWordA, pWordB) {
			if(pWordA.count > pWordB.count) {
				return -1;
			}
			
			if(pWordA.count < pWordB.count) {
				return 1;
			}
			
			return 0;
		});
		
		wordsCounted = wordsCounted.slice(0, this.termCount);
		
		var wordsToSearch = new Array();
		
		for(var n = 0; n < wordsCounted.length; n++) {
			wordsToSearch[n] = wordsCounted[n].word;
		}
		
		this.findRelatedVideos(wordsToSearch);
	};
	
	this.findRelatedVideos = function (words) {
		var url = "http://api.brightcove.com/services/library?";
		var data = {
			token: this.token,
			callback: "BCContextAware.callback",
			command: "search_videos",
			video_fields: "id,name,shortDescription,thumbnailURL",
			get_item_count: "true",
			exact: "false",
			page_number: "0",
			page_size: this.returnCount
		};
		
		for(var item in data) {
			url += "&" + item + "=" + data[item];
		}
		
		for(var i = 0; i < words.length; i++) {
			url += "&any=" + words[i];
		}
		
		this.inject(url);
	};
	
	this.inject = function (pQuery) {
		var element = document.createElement("script");
		element.setAttribute("src", pQuery);
		element.setAttribute("type", "text/javascript");
		document.getElementsByTagName("head")[0].appendChild(element);

		return true;
	};
	
	this.trim = function (pString) {
		var	pString = pString.replace(/^\s\s*/, '');
		var space = /\s/;
		var i = pString.length;
		
		while (space.test(pString.charAt(--i)));
		
		return pString.slice(0, i + 1);
	}
	
	this.error = function (pText) {
		if(typeof console == "defined") {
			console.log(pText);
		}
	};
};