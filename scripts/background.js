function getMessage(request, sender, sendResponse) {
    if (request.action === "getLinks") {
      sendResponse({ links: getArticleLinks() });
    } else if (request.action === "getContent" ) {
      sendResponse({ content: getArticleContent() });
    } else if(request.action === "generateNewTabs") {
      sendResponse({content: createTabAndFetch(request.urls)});
    }
}

  async function createTabAndFetch(urls) {
    const promises = urls.map(url => {
      return new Promise((resolve, reject) => {
        chrome.tabs.create({ url, active: false }, function (tab) {
            chrome.tabs.remove(tab.id);
        });
      });
    });
    const contents = await Promise.all(promises);
    return contents;
  }

chrome.runtime.onMessage.addListener(getMessage);