(function() {

  var module = angular.module('PlayerApp');

  module.controller('BrowseCategoryController', function($scope, API, $routeParams, Auth) {
    $scope.categoryname = '';

    API.getBrowseCategory($routeParams.categoryid).then(function(result) {
      $scope.categoryname = result.name;
      $scope.data = result
    });
    API.getBrowseCategoryPlaylists($routeParams.categoryid, Auth.getUserCountry()).then(function(results) {
      $scope.playlists = results.playlists.items;
    });
  });

})();
