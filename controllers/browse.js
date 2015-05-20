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
      // @todo: description, follower count
      $scope.newReleases = results.albums.items;
    });

    API.getBrowseCategories().then(function(results) {
      $scope.genresMoods = results.categories.items;
    });
  });

})();
