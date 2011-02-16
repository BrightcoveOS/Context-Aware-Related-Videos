function RelatedVideosWidget(whereToInsertHTML)
{
	var _token = "oTrsTJUaC72daLrPxBXio4DUnrWxP1mCbLUanUGr_8g.";
	var _tagsToScrape = ['p', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	var _numberOfTerms = 4; //the number of terms to use for the search call
	
	(function initialize()
	{		
		var tagContents = [];
		for(var i = 0; i < _tagsToScrape.length; i++)
		{
			var tag = _tagsToScrape[i];
			var tags = document.getElementsByTagName(tag);
			
			for(var j = 0; j < tags.length; j++)
			{
				var item = tags[j];
				
				if(item)
				{
					var words = item.innerHTML.replace(/[.,!?:;'"-]+/g, '').replace(/<[a-zA-Z0-9=#-_\s"'\/\.][^>]*>/gi, '').split(' ');
					for(var k = 0 ; k < words.length; k++)
					{
						if(words[k].length > 3)
						{
							tagContents.push(words[k].toLowerCase());
						}
					}
				}
			}
		}
		
		var wordsCounted = [];
		for(var i = 0 ; i < tagContents.length; i++)
		{
			var wordToCheck = tagContents[i];
			var wordFound = false;
			
			for(var j = 0; j < wordsCounted.length; j++)
			{
				if(wordsCounted[j].word == wordToCheck)
				{
					wordsCounted[j].count += 1;
					
					wordFound = true;
					break;
				}
			}
			
			if(!wordFound)
			{
				var wordToStore = {
					word: wordToCheck,
					count: 1
				};
				
				wordsCounted.push(wordToStore);
			}
		}
			
		wordsCounted.sort(compareWordCount);
		
		var wordsToSearch = [wordsCounted[0].word];
		findRelatedVideos(wordsToSearch);
	}());
	
	function compareWordCount(wordA, wordB)
	{
		if(wordA.count > wordB.count)
		{
			return -1;
		}
		
		if(wordA.count < wordB.count)
		{
			return 1;
		}
		
		return 0;
	}
	
	function findRelatedVideos(words)
	{
		var url = "http://api.brightcove.com/services/library?callback=?";
		var data = {
			token: _token,
			command: "search_videos",
			video_fields: "id,name,shortDescription,thumbnailURL",
			get_item_count: "true",
			any: words.join(' '),
			exact: "false"
		};
		
		for(var item in data)
		{
			url += "&" + item + "=" + data[item];
		}
		
		$.ajax({
			url: url,
			context: this,
			dataType: 'jsonp',
			success: function(response)
			{
				var html = "";

				for(var i = 0; i < response.items.length; i++)
				{
					var video = response.items[i];
					
					html += "<li id='" + video.id + "'>\
						<img src='" + video.thumbnailURL + "' />\
						<h5>" + video.name + "</h5>\
						<p>" + video.shortDescription + "</p>\
					</li>";
				}
				
				$(whereToInsertHTML).html(html);
			}
		});
	}	
}