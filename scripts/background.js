function getMessage(request, sender, sendResponse) {
  if (request.action === "generateNewTabs") {
    createTabs(request.urls);
  }
}

async function createTabs(urls) {
  for (const url of urls) {
    chrome.tabs.create({ url: url[1] });
  }
}

chrome.runtime.onMessage.addListener(getMessage);