var j = document.createElement('script');
j.src = chrome.extension.getURL('jquery-2.2.0.min.js');
j.onload = function() {
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('youtube-bookmarks.js');
  s.onload = function() {
    this.parentNode.removeChild(this);
  };

  (document.head || document.documentElement).appendChild(s);

  this.parentNode.removeChild(this);
};

(document.head || document.documentElement).appendChild(j);
