app.directive('productlist', ['$sessionStorage',
function($sessionStorage) {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            config: '=',
            clicked: '&'
        },
        templateUrl: 'js/directives/productlist.html',
        link: function(scope, element, attrs) {
            scope.fillDescription = function(product) {
                $('#title-box').text(product.name);
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
                    if($sessionStorage.kitConfiguration == null) {
                        $sessionStorage.kitConfiguration = [product];
                        $sessionStorage.clicked = [idx];
                    } else {
                        $sessionStorage.kitConfiguration.push(product);
                        $sessionStorage.clicked.push(idx);
                    }
                }
            };
        }
    };
}]);
