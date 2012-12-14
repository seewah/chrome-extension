function onLogIn() {
	fetchFeed();
	chrome.alarms.create('fetchFeed', {periodInMinutes: 5});
};
function onLogOut() {
	chrome.alarms.clear('fetchFeed');
};
function onAlarm(alarm) {
	if(alarm.name == 'monitorLoginStatus') monitorLoginStatus(onLogIn, onLogOut);
	else if(alarm.name == 'fetchFeed') fetchFeed();
}
function onInit() {
	setupSearchCtxMenu();
	monitorLoginStatus(onLogIn, onLogOut);
	chrome.alarms.create('monitorLoginStatus', {periodInMinutes: 0.1});
}
chrome.runtime.onInstalled.addListener(onInit);
chrome.alarms.onAlarm.addListener(onAlarm);
