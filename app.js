$(document).ready(function() {

        // Look for returned hash token from Spotify
        // Regex to find only the access token from the URL
        var tokenMatches = window.location.hash.match(/access_token=(.*)&token_type=*/);

        if (tokenMatches) {

            var accessToken = tokenMatches[1];

            // Store the values in session storage that will be cleared when the browser closes
            // Local storage would persist when the browser closes, which we don't want

            window.sessionStorage.setItem("spotify_access_token", accessToken);

            alert("Token stored!")
        };

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
              //console.log(searchSong);
              searchURL = "https://api.spotify.com/v1/search?q=" + searchSong + "&type=track";
              $.ajax({
                  type: "GET",
                  url: searchURL,
                  success: function(results) {
                      // The results are returned as an object containing tracks
                      // and an array of items. Iterate through this array to
                      // display the details
                      results.tracks.items.forEach (function(track) {
                            songDetails = {};
                            songDetails.songName = track.name;
                            songDetails.songPreview = track.preview_url;
                            songDetails.artistName = track.artists[0].name;
                            songDetails.albumName = track.album.name;
                            songDetails.songImage = track.album.images[0].url;
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

          // Login to Spotify


          // $("#spotify-login").on('click', function () {
          //     // Request authorization from Spotify
          //     var client_id = '460670788eaf43a8b9d871386bbb719e';
          //     var redirect_uri = 'http://localhost:3000/';
          //     var scope = 'user-library-read user-library-modify';
          //     var url = 'https://accounts.spotify.com/authorize';
          //     url += '?response_type=token';
          //     url += '&client_id=' + encodeURIComponent(client_id);
          //     url += '&scope=' + encodeURIComponent(scope);
          //     url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
          //     window.location = url;
          //       $.ajax({
          //           type: "GET",
          //           url: "https://accounts.spotify.com/authorize?client_id=460670788eaf43a8b9d871386bbb719e&response_type=token&redirect_uri=http://localhost:3000&scope=user_library_read user_library_modify",
          //           success: function(results) {
          //               console.log(results);
          //                   alert("Stored token!");
          //           },
          //           error: function(request, status, error) {
          //               console.log(request);
          //               console.log(error);
          //               alert("There was an error authorizing with Spotify");
          //           }
          //
          //       // end of Ajax call
          //       });
          // // end of #spotify-login on click
          // });


// End of document ready
});
