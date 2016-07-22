app.directive('productlist', ['currentKit', '$sessionStorage',
function(currentKit, $sessionStorage) {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            config: '='
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
                    currentKit.push(product);
                    $sessionStorage.kitConfiguration = currentKit;
                }
            };
        }
    };
}]);
