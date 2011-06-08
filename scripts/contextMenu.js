/**
 * Opens mendeley search in new tab
 */
function openSearchPage(info, tab) {
	var props = new Object();
	props.url = mendeleyUrl + 'research-papers/search/?query=' + encodeURIComponent(info.selectionText);
	chrome.tabs.create(props);
}

/**
 * init
 */
function setupSearchCtxMenu() {
	var title = "Search for '%s' in Mendeley";
	chrome.contextMenus.create({"title": title, "contexts":['selection'], "onclick": openSearchPage});
}