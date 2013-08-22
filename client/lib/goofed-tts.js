GoofedTTS = (function() {
  var BASE_URL = "http://tts-api.com/tts.mp3?q="
  var audio = new Audio();

  audio.addEventListener('ended', function() {
    console.log("Finished speaking");
  });

  return {
    speak: function(text) {
      audio.src = BASE_URL + text;
      console.log('Will speak "' + text + '". TTS url: ' + audio.src);
      audio.play();
    }
  }
})();
