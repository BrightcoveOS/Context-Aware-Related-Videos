About
=====

This project provides a list of related videos based on page content.

Language Packs
==============

To help ignore commonly used words (e.g. "a", "and", "the"), "stop word"
language packs are available for various languages. Simply download the
language pack you wish to use and include the file along with the main
application.

In order to decrease the number of file transfers, you may wish to simply
copy and paste the contents of the language pack after the end of the
core code.

If you add any words to the lists, please consider patching the language
pack so others may benefit.

Parameters
==========

 * __callback__ - A function to run when the videos have been retrieved
 * __content__ - The ID of the DOM element to parse for relevant words (Optional)
 * __tags__ - An array of tags to parse (e.g. `["h1", "h2", "p"]`) (Optional)
 * __terms__ - The number of words to search on (Default: 5)
 * __token__ - Your Brightcove Read API token
 * __videos__ - The number of related videos to return (Default: 5)
 * __videoFields__ - The fields to retrieve for each video (Default: "id,name,shortDescription,thumbnailURL")
 * __videoSort__ - The sort to apply to related videos (Default: "PUBLISH_DATE:DESC")

Usage
=====

	<!-- Include the application file -->
	<script src="bc-context-aware.js" type="text/javascript"></script>
	
	<!-- Include the relevant language pack -->
	<script src="bc-context-aware-stopwords.js" type="text/javascript"></script>
	
	<!-- Instantiate and use the plug-in -->
	<script type="text/javascript">
		// You should wait until the window or DOM loads before calling this function
		// Putting the initialization call at the end of your body will also work
		window.onload = function() {
		
			// Initialize the script
			BCContextAware.init({
				content: "myContent",
				token: "oTrsTJUaC72daLrPxBXio4DUnrWmCbLUanUGr_8g.",
				terms: 5,
				videos: 10,
				callback: function(pData) {
					// Output our related videos to the console for testing
					console.log(pData);
					
					/**
					 * Use this space to dynamically populate a section
					 * of your page with the related videos.
					 */
				}
			});
		};
	</script>