app.directive('productlist', function() {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            filters: '='
        },
        templateUrl: 'js/directives/productlist.html'
    };
});
