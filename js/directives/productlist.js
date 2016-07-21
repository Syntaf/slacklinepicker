app.directive('productlist', function() {
    return {
        restrict: 'E',
        scope: {info: '='},
        templateUrl: 'js/directives/productlist.html'
    };
});
