app.controller('AddItemController', ['$scope', 'products', function($scope, products) {
    products.query('Hardware', 'Pulleys').success(function(data) {
        $scope.lproducts = data;
    });
    console.log('loaded!');
}]);
