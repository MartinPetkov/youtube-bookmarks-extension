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


window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: ");console.log(event.data);

    var current_time = event.data.current_time;
    var description = event.data.description;
    console.log(current_time, description);

    if(event.data.operation == 'added_bookmark') {
      // TODO: Save these in Chrome storage
    } else if(event.data.operation == 'removed_bookmark') {
      // TODO: Remove the bookmark
    }

  }
}, false);

function addBookmark() {
  window.postMessage({type: "FROM_CONTENT_SCRIPT", add_current_bookmark: true}, "*");
}


window.onload = function () {
  console.log('Hello World!');

  yt = document.getElementById('movie_player');

  // Add the sidebar
  var sidebar = $(document.createElement('div'));
  sidebar.addClass('youtube-bookmarks-sidebar wordwrap');

  var add_bookmark_button = $(document.createElement('button'));
  add_bookmark_button.addClass('yt-uix-button yt-uix-button-default youtube-bookmarks-button');
  add_bookmark_button.prop('value', 'Add Bookmark');
  add_bookmark_button.text('Add Bookmark');
  add_bookmark_button.click(addBookmark);
  add_bookmark_button.removeAttr('onhover');
  sidebar.append(add_bookmark_button);

  var description = $('<input type="text" name="youtube-bookmark-description" id="youtube-bookmark-description" placeholder="Description"></input>');
  description.addClass('youtube-bookmark-description');
  sidebar.append(description);

  var bookmarks_title = $(document.createElement('div'));
  bookmarks_title.addClass('youtube-bookmarks-title');
  bookmarks_title.text('Bookmarks');
  sidebar.append(bookmarks_title);

  var bookmarks_list = $(document.createElement('ul'));
  bookmarks_list.attr('id', 'youtube-bookmarks-list');
  sidebar.append(bookmarks_list);

  sidebar.insertBefore(yt);
}

