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

var l1 = document.createElement('link');
l1.rel = 'stylesheet';
l1.type = 'text/css';
l1.href = 'https://fonts.googleapis.com/css?family=Ubuntu';
(document.head || document.documentElement).appendChild(l1);

var l2 = document.createElement('link');
l2.rel = 'stylesheet';
l2.type = 'text/css';
l2.href = 'https://fonts.googleapis.com/css?family=Consolas';
(document.head || document.documentElement).appendChild(l2);


function showMessage(msg, color) {
  msg_box = $("#youtube-bookmark-message");
  msg_box.text(msg);
  msg_box.css('color', color)

  msg_box.css('visibility', 'visible');
  setTimeout(function() {
    msg_box.css('visibility', 'hidden');
  }, 5000)
}

function getWatchUrl() {
  var url = window.location.href;
  return url.slice(url.indexOf('watch?v=')+8, (url.indexOf('#') > -1 ? url.indexOf('#') : url.length))
}


window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {

    var current_time = event.data.current_time;
    var description = event.data.description;

    var url = getWatchUrl();

    if(event.data.operation == 'added_bookmark') {
      // Add a bookmark to storage
      chrome.storage.sync.get(url, function(res) {
        var items = [];

        if(res[url]) {
          var items = res[url].items;
          if(!items) {
            items = [];
          }
        }

        items.push({'current_time': current_time, 'description': description});

        var obj = {};
        obj[url] = {'items': items};
        chrome.storage.sync.set(obj, function () {
          // Notify that we saved
          showMessage('Bookmark saved', 'green');
        });
      });

    } else if(event.data.operation == 'removed_bookmark') {
      // Remove the bookmark from storage
      chrome.storage.sync.get(url, function(res) {
        if(res[url]) {
          var items = res[url].items;
          if(items) {
            // Find this bookmark, or one just like it, in the array
            for(var i = 0; i < items.length; i++) {
              if(items[i].current_time == current_time
                  && items[i].description == description) {
                items.splice(i, 1); // Convoluted way to remove an element at that index
                break;
              }
            }
          }

          var obj = {};
          obj[url] = {'items': items};
          chrome.storage.sync.set(obj, function () {
            // Notify that we removed the bookmark
            showMessage('Bookmark removed', 'red');
          });
        }
      });
    }
  }
}, false);


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.operation == 'toggle_sidebar') {
      if(request.visible) {
          $('#youtube-bookmarks-sidebar').fadeIn();
      } else {
          $('#youtube-bookmarks-sidebar').fadeOut();
      }
    }
  });

function addBookmark() {
  window.postMessage({type: "FROM_CONTENT_SCRIPT", add_current_bookmark: true}, "*");
}


function loadBookmarks() {
  yt = document.getElementById('movie_player');

  chrome.storage.sync.get('sidebarVisible', function(res) {
    // Remove old sidebar if it's there
    var oldSidebar = $('#youtube-bookmarks-sidebar');
    if(oldSidebar.length == 0) {
      oldSidebar.remove();
    }

    var visible = res['sidebarVisible'] && res['sidebarVisible']['visible'];

    // Add the sidebar
    var sidebar = $(document.createElement('div'));
    sidebar.addClass('youtube-bookmarks-sidebar wordwrap');
    sidebar.attr('id', 'youtube-bookmarks-sidebar');
    sidebar.css('display', (visible ? 'initial' : 'none'));

    var add_bookmark_button = $(document.createElement('button'));
    add_bookmark_button.attr('id', 'youtube-bookmarks-button');
    add_bookmark_button.addClass('yt-uix-button yt-uix-button-default youtube-bookmarks-button');
    add_bookmark_button.prop('value', 'Add Bookmark');
    add_bookmark_button.text('Add Bookmark');
    add_bookmark_button.click(addBookmark);
    add_bookmark_button.removeAttr('onhover');
    sidebar.append(add_bookmark_button);

    var description = $('<input type="text" name="youtube-bookmark-description" id="youtube-bookmark-description" placeholder="Description"></input>');
    description.addClass('youtube-bookmark-description search-term masthead-search-renderer-input');
    sidebar.append(description);

    var message_box = $('<span id="youtube-bookmark-message">Placeholder</span>');
    sidebar.append(message_box);

    var bookmarks_title = $(document.createElement('div'));
    bookmarks_title.addClass('youtube-bookmarks-title');
    bookmarks_title.text('Bookmarks');
    sidebar.append(bookmarks_title);

    var bookmarks_list = $(document.createElement('table'));
    bookmarks_list.attr('id', 'youtube-bookmarks-list');
    sidebar.append(bookmarks_list);

    // Load data from storage and add it to the list of bookmarks
    var url = getWatchUrl();
    chrome.storage.sync.get(url, function(res) {
      if(res[url]) {
        var items = res[url].items;
        for(var i = 0; i < items.length; i++) {
          window.postMessage({type: "FROM_CONTENT_SCRIPT", add_bookmark: true, sec_num: items[i].current_time, description: items[i].description}, "*");
        }
      }
    });

    sidebar.insertBefore(yt);

    // Allow user to add bookmark with the Enter key
    $('#youtube-bookmark-description').keypress(function(e){
        if(e.keyCode == 13) {
          $('#youtube-bookmarks-button').click();
        }
    });
  });
}


window.onload = loadBookmarks;

// Not the best way, but if user clicks on different video, reload bookmarks
var currentUrl = window.location.href;
setInterval(function() {
  if(window.location.href != currentUrl) {
    currentUrl = window.location.href;
    loadBookmarks();
  }
}, 500);
