(function() {

  var module = angular.module('PlayerApp');

  module.controller('BrowseController', function($scope, API, Auth, $routeParams) {

    function pad(number) {
      if ( number < 10 ) {
        return '0' + number;
      }
      return number;
    }

    /**
     * Returns an ISO string containing the local time for the user,
     * clearing minutes and seconds to improve caching
     * @param  Date date The date to format
     * @return string The formatted date
     */
    function isoString(date) {
      return date.getUTCFullYear() +
        '-' + pad( date.getUTCMonth() + 1 ) +
        '-' + pad( date.getUTCDate() ) +
        'T' + pad( date.getHours() ) +
        ':' + pad( 0 ) +
        ':' + pad( 0 )
    }

    API.getFeaturedPlaylists(Auth.getUserCountry(), isoString(new Date())).then(function(results) {
      $scope.featuredPlaylists = results.playlists.items;
      $scope.message = results.message;
    });

    API.getNewReleases(Auth.getUserCountry()).then(function(results) {
      $scope.newReleases = results.albums.items;

      // find out if they are in the user's collection
     /* var ids = $scope.tracks.map(function(track) {
        return track.id;
      });

      API.containsUserTracks(ids).then(function(results) {
        results.forEach(function(result, index) {
          $scope.tracks[index].inYourMusic = result;
        });
      });*/

    });

  });

})();
