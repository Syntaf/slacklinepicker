app.controller('MainController', ['$scope', 'currentKit', '$sessionStorage',
function($scope, currentKit, $sessionStorage) {

    console.log($sessionStorage);
    $scope.kit = $sessionStorage.kitConfiguration;
    if($scope.kit != null) {
        currentKit = $sessionStorage.kitConfiguration;
    }
    $scope.wipeKit = function() {
        $sessionStorage.$reset();
        $scope.kit = null;
    }
}]);
