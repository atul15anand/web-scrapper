function getMessage(request, sender, sendResponse) {
  if (request.action === "generateNewTabs") {
    createTabs(request.urls);
  } else if(request.action === "response with true was received"){
    console.log("true was sent from background.js to content");
  } 
  else if (request.action === "send message"){
    let data = request.data;
    console.log(data);

    fetch("http://0.0.0.0:3002/matching_articles/fetch_sharable_article_data", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("ok");
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.remove(tabs[0].id);
          });
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
}

async function createTabs(urls) {
  for (const url of urls) {
    if(url.includes("/news/2023") && !url.includes("subscriber-only")){
      chrome.tabs.create({ url: url });
    }
  }
}

chrome.runtime.onMessage.addListener(getMessage);

