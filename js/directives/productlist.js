app.directive('productlist', ['$cookies', 'currentKit', function($cookies, currentKit) {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            selected: '='
        },
        templateUrl: 'js/directives/productlist.html',
        link: function(scope, element, attrs) {
            scope.fillDescription = function(product) {
                $('#description-box').text(product.description);
                $('#description-box').append(
                    '<a target="_blank" href=' + product.link +
                    ' id="product-link">Product Page</a>');
            }

            scope.addToKit = function(idx, product) {
                var amount = $('#amount-box' + idx).val();
                if(amount == 0) {
                    $('#amount-box' + idx).addClass('red-border');
                } else {
                    $('#amount-box' + idx).removeClass('red-border');
                    product.amount = amount;
                    currentKit.push(product);
                    $cookies.putObject('kitConfiguration', currentKit);
                }
            };
        }
    };
}]);
