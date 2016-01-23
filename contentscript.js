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


function showMessage(msg, color) {
  msg_box = $("#youtube-bookmark-message");
  msg_box.text(msg);
  msg_box.css('color', color)

  msg_box.css('display', 'block');
  setTimeout(function() {
    msg_box.css('display', 'none');
    msg_box.text('');
  }, 5000)
}


window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: ");console.log(event.data);

    var current_time = event.data.current_time;
    var description = event.data.description;
    console.log(current_time, description);

    var url = window.location.href;

    if(event.data.operation == 'added_bookmark') {
      // Add a bookmark to storage
      chrome.storage.sync.get(url, function(res) {
        var items = res.items;
        console.log(res);
        if(!items) {
          items = [];
        }

        items.push({'current_time': current_time, 'description': description});
        chrome.storage.sync.set({url: {'items': items}}, function () {
          // Notify that we saved
          showMessage('Bookmark saved', 'green');
        });
      });

    } else if(event.data.operation == 'removed_bookmark') {
      // Remove the bookmark from storage
      chrome.storage.sync.get(url, function(res) {
        var items = res.items;
        console.log(res);
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

        chrome.storage.sync.set({url: {'items': items}}, function () {
          // Notify that we removed the bookmark
          showMessage('Bookmark removed', 'red');
        });
      });
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

  var message_box = $('<span id="youtube-bookmark-message" style="display: none;"></span>');
  sidebar.append(message_box);

  var bookmarks_title = $(document.createElement('div'));
  bookmarks_title.addClass('youtube-bookmarks-title');
  bookmarks_title.text('Bookmarks');
  sidebar.append(bookmarks_title);

  var bookmarks_list = $(document.createElement('ul'));
  bookmarks_list.attr('id', 'youtube-bookmarks-list');
  sidebar.append(bookmarks_list);

  // TODO: Load data from storage and add it to the list of bookmarks
  var url = window.location.href;
  chrome.storage.sync.get(url, function(res) {
    var items = res.items;
    console.log(res);
    console.log(items);
  });

  sidebar.insertBefore(yt);
}

