window.onload = function() {
    const content1 = document.getElementsByClassName("content")[0];
    const content2 = document.getElementsByClassName("content")[2];
    const headline = document.querySelector(".detail__headline");
    const date = document.querySelector('meta[name="publish-date"]');
    const dateContent = date ? date.getAttribute("content") : null;

    const contentText1 = content1 ? content1.innerText : "";
    const contentText2 = content2 ? content2.innerText : "";
    const headlineText = headline ? headline.innerText : "";

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
        published_at: dateContent,
        title: headlineText.trim()
    }

    const data = {
      api_key: "345311",
      content: content,
    };
    chrome.runtime.sendMessage({action: "fetchContentFromUrls", data: data});
};