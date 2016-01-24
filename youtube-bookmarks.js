function getCurrentVideoTime() {
  return document.getElementById('movie_player').getCurrentTime();
}

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

function makeSeekTo(h, m, s){
  return 'document.getElementById("movie_player").seekTo(('+h.toString()+'*60+'+m.toString()+')*60+'+s.toString()+');return false;';
}

function removeBookmark() {
  var parent_tr = $(this).parent().parent();
  window.postMessage({type: "FROM_PAGE", operation: "removed_bookmark", current_time: parent_tr.attr('sec_num'), description: parent_tr.attr('description')}, "*");
  parent_tr.remove();
}


function insertBookmark(sec_num, description) {
  var a = $(document.createElement('a'));
  a.addClass('youtube-bookmark');
  a.attr('href', '#');
  a.attr('onclick', makeSeekTo(getHours(sec_num), getMinutes(sec_num), getSeconds(sec_num)));
  a.text(makeStrTime(sec_num))

  var a_remove_btn = $('<button type="button" class="yt-uix-button yt-uix-button-default a-remove-btn" aria-label="Remove">X</button>');
  a_remove_btn.click(removeBookmark);


  var tr = $(document.createElement('tr'));
  tr.attr('sec_num', sec_num);
  tr.attr('description', description);

  var td1 = $(document.createElement('td'));
  td1.attr('width', '20%');
  td1.addClass('youtube-bookmark-td');
  td1.append(a_remove_btn);

  var td2 = $(document.createElement('td'));
  td2.attr('width', '80%');
  td2.addClass('youtube-bookmark-td');
  td2.append(a);

  if(description) {
    var desc = $(document.createElement('span'));
    desc.text(': ' + description);
    td2.append(desc);
  }

  tr.append(td1);
  tr.append(td2);
  $('#youtube-bookmarks-list').append(tr);
}


window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_CONTENT_SCRIPT")) {
    if(event.data.add_current_bookmark) {
      var sec_num = getCurrentVideoTime();
      var description = $('#youtube-bookmark-description').val();
      $('#youtube-bookmark-description').val('');

      insertBookmark(sec_num, description);

      // Send back data so it can be stored
      window.postMessage({type: "FROM_PAGE", operation: "added_bookmark", current_time: sec_num, description: description}, "*");


    // Adds an existing bookmark loaded from storage
    } else if (event.data.add_bookmark) {
      insertBookmark(event.data.sec_num, event.data.description);
    }
  }
}, false);
