function getMessage(request, sender, sendResponse) {
  if (request.action === "generateNewTabs") {
    createTabs(request.urls);
  } else if (request.action === "send message"){
    let data = request.data;
    
    
    fetch("http://0.0.0.0:3002/matching_articles/fetch_sharable_article_data", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const tab = tabs[0];
          const flagToClose = getParameterByName("flagToClose", tab.url);
          if (flagToClose === "true" && response.ok) {
            chrome.tabs.remove(tab.id);
          }
        });
      })
      .catch((error) => {
        console.log("error occured");
      });
  }
}

function getParameterByName(name, url) {
  const searchParams = new URLSearchParams(new URL(url).search);
  return searchParams.get(name);
}

let urlsToOpen = [];
let tabsOpened = 0;

async function createTabs(urls) {
  urlsToOpen = urls.filter(url => url.includes("/news/2023"));
  openNextTab();
}

function openNextTab() {
  if (urlsToOpen.length > 0) {
    const url = urlsToOpen.shift();
    const modifiedUrl = url + "?flagToClose=true";
    chrome.tabs.create({url: modifiedUrl}, function(tab) {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
        if (tabId === tab.id && changeInfo.status === "complete" && updatedTab.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);
          setTimeout(openNextTab, 1000);
        }
      });
    });
  }
}
chrome.runtime.onMessage.addListener(getMessage);

