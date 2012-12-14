$(function() {
	var searchBoxInitialText = 'Search papers...';
	var searchBox = $('#search-box input');
	searchBox.val(searchBoxInitialText);
	searchBox.focus(function() {
		searchBox.val('');
		searchBox.addClass('focus');
	});		
	searchBox.blur(function() {
		if(searchBox.val() == '') {
			searchBox.val(searchBoxInitialText);
		}
		searchBox.removeClass('focus');
	});
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
	$('.site-link').live('click', function() {			
		chrome.tabs.create({'url':$(this).attr('href')});
		e.preventDefault();
	});
	if(chrome.extension.getBackgroundPage().loggedIn) {
		$('#logged-out').hide();
		chrome.extension.getBackgroundPage().renderFeed($('#feed-items'));
	}
	else {
		$('#logged-in').hide();
	}
});
