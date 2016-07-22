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
        $scope.total = 0;
    }

    $scope.removeItem = function(id) {
        $sessionStorage.kitConfiguration =
        $.grep($sessionStorage.kitConfiguration, function(e) {
            if(e.id == id) {
                $scope.total -= e.price * e.amount;
            }
            return e.id != id;
        });

        $sessionStorage.clicked =
        $.grep($sessionStorage.clicked, function(e) {
            return e != id;
        });

        $scope.kit = $sessionStorage.kitConfiguration;
    }
}]);
