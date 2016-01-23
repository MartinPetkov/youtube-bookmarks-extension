function makeStrTime(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

    if (hours <= 0) {
      hours = '';
    } else if (hours < 10) {
      hours   = '0' + hours + ':';
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return hours + minutes + ':' + seconds;
}

function getHours(sec_num) {
  return Math.floor(sec_num / 3600);
}

function getMinutes(sec_num) {
  return Math.floor((sec_num - (getHours(sec_num) * 3600)) / 60);
}

function getSeconds(sec_num) {
  return Math.floor(sec_num - (getHours(sec_num) * 3600) - (getMinutes(sec_num) * 60));
}

function getCurrentVideoTime() {
  return document.getElementById('movie_player').getCurrentTime();
}


function makeSeekTo(h, m, s){
  return 'yt.seekTo(('+h.toString()+'*60+'+m.toString()+')*60+'+s.toString()+');return false;';
}


function addBookmark() {
  var sec_num = getCurrentVideoTime();
  var description = $('#youtube-bookmark-description').val();
  $('#youtube-bookmark-description').val('');

  var a = $(document.createElement('a'));
  a.addClass('youtube-bookmark');
  a.attr('href', '#');
  a.attr('onclick', makeSeekTo(getHours(sec_num), getMinutes(sec_num), getSeconds(sec_num)));
  a.text(makeStrTime(sec_num))

  var a_remove_btn = $('<button type="button" class="yt-uix-button yt-uix-button-default a-remove-btn" aria-label="Remove"><bold>X<bold></button>');
  a_remove_btn.click(removeBookmark);

  var li = $(document.createElement('li'));
  li.addClass('youtube-bookmark-li');
  li.append(a_remove_btn);
  li.append(a);

  if(description) {
    var desc = $(document.createElement('span'));
    desc.text(': ' + description);
    li.append(desc);
  }

  $('#youtube-bookmarks-list').append(li);
}


function removeBookmark() {
  $(this).parent().remove();
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
