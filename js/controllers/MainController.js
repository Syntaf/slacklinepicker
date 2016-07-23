app.controller('MainController', ['$scope', 'products', '$sessionStorage',
'$routeParams', '$window', function($scope, products, $sessionStorage,
$routeParams, $window) {

    $scope.total = 0;

    if($routeParams.configuration != null) {
        /*
        *  -- Shareable section --
        *  This section is entered if a user uses a shareable link
        *  to view someone else's configuration
        */
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
                        e.amount = x.amount;
                        $scope.total += e.price * e.amount;
                        found = true;
                    }
                });
                return found;
            });

            console.log($scope.kit);
        });
    } else {
        /*
         *  -- Main App Section --
         *  If a user visits the webpage normalling, this is the section
         *  entered.
        */
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

        $scope.generateShareableHook = function() {
            $scope.link = "";
            $scope.kit.forEach(function(product) {
                $scope.link += product.id;
                if(product.amount > 1) {
                    $scope.link += '&' + product.amount;
                }
                $scope.link += '-';
            });
            $scope.link = $scope.link.slice(0, -1);
            $scope.rawLink = $window.location.hostname + '/' +
                $window.location.hash + $scope.link;
            $scope.shareLink = true;
        }

        $scope.showCopiedLabel = function () {
            $('#show-copied').css('display','inline-block').delay(1500).fadeOut();
        }
    }
}]);
