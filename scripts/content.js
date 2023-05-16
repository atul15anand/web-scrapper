  function getMessage(request, sender, sendResponse) {
    if (request.action === "getLinks") {
      sendResponse({ links: getArticleLinks() });
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
  