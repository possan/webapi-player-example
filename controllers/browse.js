(function() {

  var module = angular.module('PlayerApp');

  module.controller('BrowseController', function($scope, API, Auth, $routeParams) {

    API.getFeaturedPlaylists(Auth.getUserCountry()).then(function(results) {
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
