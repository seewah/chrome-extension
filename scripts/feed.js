var xhr = new XMLHttpRequest();

var mendeleyFeedUrl = mendeleyUrl + 'feed/?outputFormat=json';

/**
 * Makes the feed AJAX request ONLY IF loggedIn == true
 */
function fetchFeed() {
	if(loggedIn) {
		xhr.open(
    			'GET',
    			mendeleyFeedUrl,
    			true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.onload = parseFeed;
		xhr.send(null);
	}
}

/**
 * Parses the json string and update the local cache
 */
function parseFeed() {
	var feedItems = JSON.parse(xhr.responseText);
	if(feedItems) {
		if(typeof(feedItems.success) !== 'undefined' && feedItems.success === false) {
			// an error has occurred
		}
		else if(feedItems.length != 0) {
			localStorage.currentFeed = xhr.responseText;
			if(localStorage.currentFeed != localStorage.viewedFeed) {
				var unreadCount = getUnreadCount();
				if(unreadCount == 0) {
					chrome.browserAction.setBadgeText({'text':''});
				}
				else {
					chrome.browserAction.setBadgeText({'text':unreadCount.toString()});
				}
			}
		}
	}
	else {
		// no valid response from server
	}
}

/**
 * Gets unread count
 */
function getUnreadCount() {
	var count = 0;
	var currentFeedUriMap = createCurrentFeedUriMap();
	var viewedFeedUriMap = createViewedFeedUriMap();
	for(var uri in currentFeedUriMap) {
		if(isItemUnread(uri, currentFeedUriMap, viewedFeedUriMap)) {
			count++;
		}
	}
	return count;
}

/**
 * Checks whether item is unread/new
 */
function isItemUnread(itemUri, currentFeedUriMap, viewedFeedUriMap) {
	if(typeof viewedFeedUriMap[itemUri] == 'undefined') {
		// new feed item
		return true;
	}
	else if(currentFeedUriMap[itemUri] != viewedFeedUriMap[itemUri]) {
		// new comment(s)
		return true;
	}
	return false;
}

/**
 * Generates temporary item uri/comments map for working out what is new in the feed
 */
function createUriMap(feedItems) {
	var map = {};
	if(feedItems !== null) {
		for(var i = 0; i < feedItems.length; i++) {
			var item = feedItems[i];
			map[item.uri] = JSON.stringify(item.comments);
		}
	}
	return map;
}

/**
 * Generated uri/comments map for the current feed data.
 */
function createCurrentFeedUriMap() {
	if(localStorage.currentFeed) {
		return createUriMap(JSON.parse(localStorage.currentFeed));
	}
	else {
		return {};
	}
}

/**
 * Generated uri/comments map for the viewed feed data.
 */
function createViewedFeedUriMap() {	
	if(localStorage.viewedFeed) {
		return createUriMap(JSON.parse(localStorage.viewedFeed));
	}
	else {
		return {};
	}
}

/**
 * Renders the feed items
 */
function renderFeed(container) {
	var currentFeedUriMap = createCurrentFeedUriMap();
	var viewedFeedUriMap = createViewedFeedUriMap();
	chrome.browserAction.setBadgeText({'text':''});
	if(localStorage.currentFeed) {
		var feedItems = JSON.parse(localStorage.currentFeed);
		for(var i = 0; i < feedItems.length; i++) {
			var item = feedItems[i];
			var unread = isItemUnread(item.uri, currentFeedUriMap, viewedFeedUriMap);
			container.append(createFeedItem(item, unread));
		}
		localStorage.viewedFeed = localStorage.currentFeed;
	}
	else {
		container.html('No feed activities...');
	}
}

/**
 * Renders individual item
 */
function createFeedItem(feedItem, unread) {
	var div = $('<article></article>');
	div.addClass('feed-item');
	if(unread) {
		div.addClass('unread');
	}
	if(feedItem.profile) {
		div.append(createProfileImg(feedItem.profile, 30));
	}
	div.append(createFeedHeader(feedItem));
	div.append(createFeedTextContent(feedItem));
	if(feedItem.comments.length > 0) {
		var comments = $('<div></div>');
		comments.addClass('comments');
		div.append(comments);
		for(var i = 0; i < feedItem.comments.length; i++) {
			comments.append(createCommentItem(feedItem.comments[i]));
		}
	}
	div.append(createFeedLink(feedItem));
	return div;
}

/**
 * Timestamp link
 */
function createFeedLink(feedItem) {
	var timeString = new Date(feedItem.modificationTime * 1000).toUTCString();
	var feedUri = feedItem.uri;
	var feedLink = $('<a></a>');
	feedLink.append(timeString);
	feedLink.attr('href', feedUri);
	feedLink.addClass('site-link');
	feedLink.addClass('feed-link');
	return feedLink;
}

/**
 * Clickable profile photo
 */
function createProfileImg(profile, width) {
	var uri = profile.uri;
	var photo = profile.photo;
	var img = $('<img/>');
	img.attr('width', width);
	img.attr('src', photo);
	var imgLink = $('<a></a>');
	imgLink.attr('href', uri);
	imgLink.addClass('site-link');
	imgLink.addClass('photo');
	imgLink.append(img);
	return imgLink;
}

/**
 * Feed header
 */
function createFeedHeader(feedItem) {
	var div = $('<header></header>');
	var headerLink = $('<a></a>');
	headerLink.addClass('site-link');
	div.append(headerLink);
	if(feedItem.group) {
		headerLink.attr('href', feedItem.group.uri);
		headerLink.text(feedItem.group.name);
	}
	else if(feedItem.profile) {
		headerLink.attr('href', feedItem.profile.uri);
		headerLink.text(feedItem.profile.name);
	}
	return div;
}

/**
 * Main text
 */
function createFeedTextContent(feedItem) {
	var div = $('<div></div>');
	div.addClass('main-content');
	div.html(feedItem.text);
	return div;
}

/**
 * Individual comment
 */
function createCommentItem(comment) {
	var div = $('<div></div>');
	div.addClass('comment');
	if(comment.profile) {
		div.append(createProfileImg(comment.profile, 25));
	}
	var text = $('<div></div>');
	text.addClass('content');
	text.text(comment.text);
	div.append(text);
	return div;
}