storedData = localStorage.getItem("articlesContentData");
articlesContentData = storedData ? JSON.parse(storedData) : {};
articleLinksData = storedData ? JSON.parse(storedData) : {};

window.onload = function () {
  // fetches are urls from current page and stores in local storage
  const fetchUrlsButton = document.getElementById("fetchUrlsButton");
  fetchUrlsButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const [tab] = tabs;
      chrome.tabs.sendMessage(tab.id, { action: "getLinks" }, function (response) {
        if (response && response.links) {
          articleLinksData = response.links;
          console.log(response.links);
          localStorage.setItem("articleLinksData", JSON.stringify(articleLinksData));
        }
      });
    });
  });

  document.getElementById("fetchContentButton").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "getLinks" }, function (response) {
      // const links = articleLinksData.slice(5, 10); // Get the next 5 links
      const links = articleLinksData.map((element) => {
        return element[1];
      });
      chrome.runtime.sendMessage({ action: "generateNewTabs", urls: links }, function (response) {
        console.log(response);
      });
    });
  });  

 };
