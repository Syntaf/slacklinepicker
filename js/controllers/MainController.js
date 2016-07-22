app.controller('MainController', ['$scope', '$sessionStorage',
function($scope, $sessionStorage) {

    $scope.kit = $sessionStorage.kitConfiguration;
    $scope.total = 0;
    if($scope.kit != null) {
        $scope.kit.forEach(function(data) {
            $scope.total += data.price * data.amount;
        })
    }
    $scope.wipeKit = function() {
        $sessionStorage.$reset();
        $scope.kit = null;
    }
}]);
