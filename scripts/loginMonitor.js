var mendeleyCookieDetails = {"url":mendeleyUrl, "name":cookieName};

var loggedIn = false;

/**
 * Checks site cookie to see whether the user is logged in. Updates the loggedIn variable accordingly. Additionally, it invokes
 * the callbacks.
 */
function monitorLoginStatus(onLogInFunc, onLogOutFunc) {
	chrome.cookies.get(mendeleyCookieDetails, function(cookie) {
		if(cookie) {
			if(!loggedIn) {
				loggedIn = true;
				chrome.browserAction.setBadgeText({'text':''});
				onLogInFunc.call();
			}
		}
		else {
			chrome.browserAction.setBadgeText({'text':'off'});
			if(loggedIn) {
				loggedIn = false;
				onLogOutFunc.call();
			}
		}
	});
}