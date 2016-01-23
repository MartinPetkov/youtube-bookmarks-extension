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
  $(this).parent().remove();
}


window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_CONTENT_SCRIPT")) {
    console.log("Page received: " + event.data);

    if(event.data.add_current_bookmark) {
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

      window.postMessage({type: "FROM_PAGE", current_time: sec_num, description: description}, "*");

    } else if (event.data.add_bookmark) {
      console.log(event.data);
    }
  }
}, false);
