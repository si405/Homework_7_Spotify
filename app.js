$(document).ready(function() {

        // Declare variables to hold the artist and song information

        var artistName = '';
        var songName = '';
        var albumName = '';
        var accessToken = '';

        // Prepare the Handlebars template

        var source = $("#song-template").html();
        var songTemplate = Handlebars.compile(source);

        // Look for returned hash token from Spotify
        // Regex to find only the access token from the URL

        if (accessToken === '') {
            var tokenMatches = window.location.hash.match(/access_token=(.*)&token_type=*/);
            if (tokenMatches) {
                accessToken = tokenMatches[1];
                // Store the values in session storage that will be cleared when the browser closes
                // Local storage would persist when the browser closes, which we don't want
                window.sessionStorage.setItem("spotify_access_token", accessToken);
            };
        };
        // When the button is clicked, access the library
        $("#view-saved-tracks").on('click', function() {
              if (accessToken === '') {
                  window.sessionStorage.getItem("spotify_access_token", accessToken);
              };
              $.ajax({
                  type: "GET",
                  url: "https://api.spotify.com/v1/me/tracks/?limit=50&offset=0",
                  headers: {
                      "Authorization": "Bearer " + window.sessionStorage.getItem("spotify_access_token")
                  },
                  success: function(results) {
                      // An object is returned that has an array of tracks
                      console.log(results);
                      $('#song-container').html("");
                      results.items.forEach(function(libraryEntry) {
                          displayTrack(libraryEntry.track);
                      // end of results.items for each
                      });
                  },
                  error: function() {
                      alert("Please log in");
                  }

              // end of Ajax call
              });
        // end of get-saved-tracks on.click
        });

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
                      $('#song-container').html("")
                      results.tracks.items.forEach (function(track) {
                            console.log(track);
                            displayTrack(track);
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

          // A function to display the returned track information

          function displayTrack(track) {
            songDetails = {};
            songDetails.songName = track.name;
            songDetails.trackID = track.id;
            songDetails.songPreview = track.preview_url;
            songDetails.artistName = track.artists[0].name;
            songDetails.albumName = track.album.name;
            songDetails.songImage = track.album.images[0].url;
            var newHTML = songTemplate(songDetails);
            $('#song-container').append(newHTML);
          // end of function displayTrack
          };

          // Store a track to the user's library
          $(document).on("click", "#add-this-track", function(event) {
              event.preventDefault();
              if (accessToken === '') {
                  window.sessionStorage.getItem("spotify_access_token", accessToken);
              };
              // Get the track to be added from the url
              var addTrackID = $(this).attr("value");

              $.ajax({
                  type: "PUT",
                  url: "https://api.spotify.com/v1/me/tracks?ids=" + addTrackID,
                  headers: {
                      "Authorization": "Bearer " + window.sessionStorage.getItem("spotify_access_token")
                  },
                  success: function(results) {
                      // An object is returned that has an array of tracks
                          alert("The track has been added to your library");
                  },
                  error: function(request, status, error) {
                      console.log("Status " + status);
                      console.log("Error " + error);
                      alert("Unable to add the track to your library");
                  }

              // end of Ajax call
              });
          // end of #add-this-track on click
          });

          // Login to Spotify

          // $("#spotify-login").on('click', function () {
          //     alert("Login clicked");
          //     // Request authorization from Spotify
          //     // var client_id = '460670788eaf43a8b9d871386bbb719e';
          //     // var redirect_uri = 'http://localhost:3000/';
          //     // var scope = 'user-library-read user-library-modify';
          //     // var url = 'https://accounts.spotify.com/authorize';
          //     // url += '?response_type=token';
          //     // url += '&client_id=' + encodeURIComponent(client_id);
          //     // url += '&scope=' + encodeURIComponent(scope);
          //     // url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
          //     // window.location = url;
          //       $.ajax({
          //           type: "GET",
          //           url: "https://accounts.spotify.com/authorize?client_id=460670788eaf43a8b9d871386bbb719e&response_type=token&redirect_uri=http://localhost:3000&scope=user-library-read user-library-modify",
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
