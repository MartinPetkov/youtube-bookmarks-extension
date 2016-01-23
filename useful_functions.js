function makeStrTime(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours <= 0) {
      hours = "";
    } else if (hours < 10) {
      hours   = "0" + hours + ":";
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
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
  return sec_num - (getHours(sec_num) * 3600) - (getMinutes(sec_num) * 60);
}

function getCurrentVideoTime() {
  return document.getElementById("movie_player").getCurrentTime();
}

function makeSeekTo(h, m, s){
  return "yt.www.watch.player.seekTo(("+h.toString()+"*60+"+m.toString()+")*60+"+s.toString()+");return false;";
}
