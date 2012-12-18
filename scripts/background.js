var loggedIn = false;

function login() {
	if(!loggedIn) {
		loggedIn = true;
		chrome.browserAction.setBadgeText({'text':''});
		fetchFeed();
		chrome.alarms.create('fetchFeed', {periodInMinutes: 5});
	}
}

function logout() {
	chrome.browserAction.setBadgeText({'text':'off'});
	if(loggedIn) {
		loggedIn = false;
		chrome.alarms.clear('fetchFeed');
	}
}

function onLoginCookieChanged(info) {
	var cookie = info.cookie;
	if(cookie.domain == cookieDomain && cookie.name == cookieName) {
		if(!info.removed) login();
		else logout();
	}
}

function checkLogin() {
	chrome.cookies.get({url: mendeleyUrl, name: cookieName}, function(cookie) {
		if(cookie) login();
		else logout();
	});
}

function onAlarm(alarm) {
	if(alarm.name == 'fetchFeed') fetchFeed();
}

function onInit() {
	setupSearchCtxMenu();
	checkLogin();
}

chrome.runtime.onInstalled.addListener(onInit);
chrome.runtime.onStartup.addListener(onInit);
chrome.cookies.onChanged.addListener(onLoginCookieChanged)
chrome.alarms.onAlarm.addListener(onAlarm);
