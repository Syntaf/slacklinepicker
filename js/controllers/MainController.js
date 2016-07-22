app.controller('MainController', ['$scope', '$cookies', 'currentKit', function($scope, $cookies, currentKit) {

    $scope.kit = $cookies.getObject('kitConfiguration');
    console.log($scope.kit);
    if($scope.kit != null) {
        currentKit = $cookies.getObject('kitConfiguration')
    }
    $scope.wipeKit = function() {
        $cookies.remove('kitConfiguration');
        $scope.kit = null;
    }
}]);
