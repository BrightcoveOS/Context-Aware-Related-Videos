About
=====

This project provides a list of related videos based on page content.

Parameters
==========

 * __content__ - The DOM element to parse for relevant words (Optional)
 * __token__ - Your Brightcove Read API token
 * __terms__ - The number of words to search on (Default: 5)
 * __videos__ - The number of related videos to return (Default: 5)
 * __callback__ - A function to run when the videos have been retrieved

Usage
=====

	<script type="text/javascript">
		// You should wait until the window or DOM loads before calling this function
		window.onload = function() {
		
			// Initialize the script
			BCContextAware.init({
				content: "myContent",
				token: "oTrsTJUaC72daLrPxBXio4DUnrWxP1mCbLUanUGr_8g.",
				terms: 5,
				videos: 10,
				callback: function(pData) {
					// Output our related videos to the console
					console.log(pData);
				}
			});
		};
	</script>