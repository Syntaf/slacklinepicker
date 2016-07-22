app.controller('MainController', ['$scope', '$sessionStorage',
function($scope, $sessionStorage) {

    $scope.kit = $sessionStorage.kitConfiguration;
    if($scope.kit != null) {
        //currentKit = $sessionStorage.kitConfiguration;
    }
    $scope.wipeKit = function() {
        $sessionStorage.$reset();
        $scope.kit = null;
    }
}]);
