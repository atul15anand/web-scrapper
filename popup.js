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

  const fetchNextFiveButton = document.getElementById("fetchNextFiveButton");
  fetchNextFiveButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const [tab] = tabs;
      chrome.tabs.sendMessage(tab.id, { action: "createTabAndFetch", urls: articleLinksData }, function (response) {
        if (response && response.content) {
          console.log(response.content);
        }
      });
    });
  });




  const fetchContentButton = document.getElementById("fetchContentButton");
  fetchContentButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const [tab] = tabs;
      chrome.tabs.sendMessage(tab.id, { action: "getContent" }, function (response) {
        console.log(response);
        if (response && response.content) {
          const data = {
            api_key: "345311",
            content: response.content,
          };
          fetch("http://0.0.0.0:3002/matching_articles/fetch_sharable_article_data", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              const message = data.message;
              const messageEl = document.getElementById("message");
              messageEl.textContent = `Message: ${message}`;
              chrome.tabs.remove(tab.id, function() {
                console.log('Tab closed');
              });
            })
            .catch((error) => {
              const message = data.message;
              const messageEl = document.getElementById("message");
              messageEl.textContent = `Message: ${message}`;
            });
        }
      });
    });
  });

  const clearButton = document.getElementById("clearButton");
  clearButton.addEventListener("click", function () {
    articleLinksData = {};
    articlesContentData = {};
    localStorage.removeItem("articlesContentData");
  });

  const printLinks = document.getElementById("printLinks")
  printLinks.addEventListener("click", function () {
    console.log(articleLinksData);
  });

  // Get content on window load
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const [tab] = tabs;
    chrome.tabs.sendMessage(tab.id, { action: "getContent" }, function (response) {
      if (tab.url.includes("/news/2023")) {
        if (response && response.content) {
          const data = {
            api_key: "345311",
            content: response.content,
          };
          fetch("http://0.0.0.0:3002/matching_articles/fetch_sharable_article_data", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              const message = data.message;
              const messageEl = document.getElementById("message");
              messageEl.textContent = `Message: ${message}`;
              chrome.tabs.remove(tab.id, function() {
                console.log('Tab closed');
              });
            })
            .catch((error) => {
              const message = data.message;
              const messageEl = document.getElementById("message");
              messageEl.textContent = `Message: ${message}`;
            });
        }
      }
    });
  });
};
