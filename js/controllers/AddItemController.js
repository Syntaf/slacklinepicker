app.controller('AddItemController', ['$scope', 'products', function($scope, products) {
    products.success(function(data) {
        $scope.lproducts = data;
    });
    console.log('loaded!');
}]);
