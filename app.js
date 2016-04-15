$(document).ready(function() {

        // Declare variables to hold the artist and song information

        var artistName = '';
        var songName = '';
        var albumName = '';

        // Prepare the Handlebars template

        var source = $("#song-template").html();
        var songTemplate = Handlebars.compile(source);

        // Search for the tracks that match the users input
        $("#search-form").on("submit", function(event) {
              event.preventDefault();
              var searchSong = encodeURIComponent($('#search-field').val())
              console.log(searchSong);
              searchURL = "https://api.spotify.com/v1/search?q=" + searchSong + "&type=track";
              $.ajax({
                  type: "GET",
                  url: searchURL,
                  success: function(results) {
                      // The results are returned as an object containing tracks
                      // and an array of items. Iterate through this array to
                      // display the details
                      console.log(results.tracks.items);
                      results.tracks.items.forEach (function(track) {
                            console.log(track);
                            songDetails = {};
                            songDetails.songName = track.name;
                            songDetails.songPreview = track.preview_url;
                            songDetails.artistName = track.artists[0].name;
                            songDetails.albumName = track.album.name;
                            songDetails.songImage = track.album.images[0].url;
                            console.log(songDetails);
                            var newHTML = songTemplate(songDetails);
                            $('#song-container').append(newHTML);
                      // end of results.tracks.item loop
                      });
                  },
                  error: function() {
                      alert("There was an error searching for that song");
                  }
              // end of Ajax call
              });
          // end of search-form on submit
          });

// End of document ready
});
