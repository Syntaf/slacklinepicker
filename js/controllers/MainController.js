app.controller('MainController', ['$scope', 'products', '$sessionStorage',
'$routeParams', '$window', function($scope, products, $sessionStorage,
$routeParams, $window) {

    $scope.total = 0;

    if($routeParams.configuration != null) {
        $scope.freeze = true;
        $scope.productListById =
            parseHook($routeParams.configuration);

        if($scope.productListById === 'ERROR') {
            $window.location.href = '#/';
        }

        console.log($scope.productListById);

        products.success(function(data) {
            $scope.lproducts = data;

            $scope.kit = $.grep($scope.lproducts, function(e) {
                var found = false;
                $scope.productListById.forEach(function(x) {
                    if(x.id == e.id) {
                        console.log('match');
                        e.amount = x.amount;
                        found = true;
                    }
                });
                return found;
            });

            console.log($scope.kit);
        });
    } else {
        $scope.kit = $sessionStorage.kitConfiguration;
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
    }
}]);
