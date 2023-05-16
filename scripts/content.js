  function getMessage(request, sender, sendResponse) {
    if (request.action === "getLinks") {
      sendResponse({ links: getArticleLinks() });
    } else if(request.action === "createTabAndFetch") {
      chrome.runtime.sendMessage({ action: "generateNewTabs", urls: request.urls }, function(response) {
        if (response && response.content) {
          sendResponse({ content: response.content });
        } else {
          sendResponse({});
        }
      });
      return true; // indicates that the response will be sent asynchronously
    }
  }

  async function createTabAndFetch(urls) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const response = await new Promise(resolve => {
      chrome.tabs.sendMessage(tab.id, { action: "generateNewTabs", urls: urls }, function (response) {
        resolve(response);
      });
    });
    if (response && response.content) {
      return response.content;
    }
  }

  function getArticleLinks() {
    let x = document.querySelectorAll("a");
    let links = []
    for (let i=0; i<x.length; i++){
      let nametext = x[i].textContent;
      let cleantext = nametext.replace(/\s+/g, ' ').trim();
      let cleanlink = x[i].href;
      if(cleanlink.includes("/news/2023/") && !(cleanlink.includes("subscriber-only"))) {
        links.push([cleantext,cleanlink]);
      }
    }
    return links;
  };
  
  chrome.runtime.onMessage.addListener(getMessage);
  