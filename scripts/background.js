function onLogIn() {
	fetchFeed();
	chrome.alarms.create('fetchFeed', {periodInMinutes: 5});
};
function onLogOut() {
	chrome.alarms.clear('fetchFeed');
};
function onAlarm(alarm) {
	if(alarm.name == 'pollLoginStatus') pollLoginStatus(onLogIn, onLogOut);
	else if(alarm.name == 'fetchFeed') fetchFeed();
}
function onInit() {
	setupSearchCtxMenu();
	pollLoginStatus(onLogIn, onLogOut);
}
chrome.runtime.onInstalled.addListener(onInit);
chrome.runtime.onStartup.addListener(onInit);
chrome.alarms.onAlarm.addListener(onAlarm);
