$(function() {
	var searchBoxInitialText = 'Search papers...';
	var searchBox = $('.search-box');
	
	$('#search form').submit(function(e) {
		var props = new Object();
		var queryString = searchBox.val();
		if(queryString == searchBoxInitialText) {
			queryString = '';
		}
		props.url = 'http://www.mendeley.com/research-papers/search/?query=' + encodeURIComponent(queryString);
		chrome.tabs.create(props);
		e.preventDefault();
	});
	$('a').live('click', function() {
		var href =	$(this).attr('href');
		if(href.indexOf("https") != 0) {
			chrome.tabs.create({'url':href});
			e.preventDefault();
		}
	});
	if(chrome.extension.getBackgroundPage().loggedIn) {
		$('#logged-out').hide();
		chrome.extension.getBackgroundPage().renderFeed($('#feed-items'));
	}
	else {
		$('#logged-in').hide();
	}
});
