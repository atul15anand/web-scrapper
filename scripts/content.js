  function getMessage(request, sender, sendResponse) {
    if (request.action === "getLinks") {
      sendResponse({ links: getArticleLinks() });
    } else if (request.action === "getContent" ) {
      sendResponse({ content: getArticleContent() });
    } else if(request.action === "createTabAndFetch") {
      sendResponse({ content: createTabAndFetch(request.urls)});
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
  
  
  function getArticleContent() {
    const content1 = document.getElementsByClassName("content")[0];
    const content2 = document.getElementsByClassName("content")[2];
    const headline = document.querySelector(".detail__headline");
    const date = document.querySelector(".js-relative-time");

    const contentText1 = content1 ? content1.innerText : "";
    const contentText2 = content2 ? content2.innerText : "";
    const headlineText = headline ? headline.innerText : "";
    const dateText = date ? date.innerText : "";

    const article_content = contentText1 + contentText2;

    // link for rss source creation
    const rss_source = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
    const rss_source_link = rss_source ? rss_source.href : "";

    // main article url uniq one
    const article_url_info = document.querySelector('link[rel="canonical"]');
    const article_url = article_url_info ? article_url_info.href : "";

    // getting image url from thumbnail
    const image_data = document.querySelector('meta[property="og:image:secure_url"]');
    const image_url = image_data ? image_data.content : null;
    
    // getting source info
    const baseTag = document.querySelector('base');
    let baseUrl = baseTag ? baseTag.href : "";
    baseUrl = baseUrl.replace(/^https?:\/\//i, "");
    baseUrl = baseUrl.replace(/^www\./i, "");

    const content = {
        rss_source_url: rss_source_link,
        article_url: article_url,
        article_content: article_content,
        image_url: image_url,
        source: baseUrl,
        published_at: dateText,
        title: headlineText.trim()
    }
    return content ? content : {};
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
  