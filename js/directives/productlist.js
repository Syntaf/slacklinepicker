app.directive('productlist', function() {
    return {
        restrict: 'E',
        scope: {
            info: '='
        },
        templateUrl: 'js/directives/productlist.html',
        link: function(scope, element, attrs) {
            scope.fillDescription = function(product) {
                $('#description-box').text(product.description);
                $('#description-box').append(
                    '<a target="_blank" href=' + product.link +
                    ' id="product-link">Product Page</a>');
            }
        }
    };
});
