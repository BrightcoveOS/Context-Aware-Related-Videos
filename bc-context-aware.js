/**
 * Brightcove Context Aware Related Videos 1.0.2 (18 FEBRUARY 2011)
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
		this.videoFields = typeof pParameters.videoFields != "undefined" ? pParameters.videoFields : "id,name,shortDescription,thumbnailURL";
		this.videoSort = typeof pParameters.videoSort != "undefined" ? pParameters.videoSort : "PUBLISH_DATE:DESC";
		
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
		
		if(typeof BCContextAware_StopWords != "undefined") {
			for(var s = wordsCounted.length; s > 0; s--) {
				if(BCContextAware_StopWords.indexOf(wordsCounted[s - 1].word) > -1) {
					wordsCounted.splice(s - 1, 1);
				}
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
			video_fields: this.videoFields,
			get_item_count: "true",
			exact: "false",
			sort_by: this.videoSort,
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