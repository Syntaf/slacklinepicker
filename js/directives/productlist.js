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
            // If a product is clicked within the database, fill the
            // description box on the left with that items description,
            // plus a couple other items
            scope.fillDescription = function(product) {
                $('#title-box').text(product.name);
                $('#description-box').text(product.description);
                $('#description-box').append(
                    '<a target="_blank" href=' + product.link +
                    ' id="product-link">Product Page</a>');
            }

            // when an item is clicked, add that item to the product list
            scope.addToKit = function(idx, product) {
                var amount = $('#amount-box' + idx).val();
                if(amount == 0) {
                    $('#amount-box' + idx).addClass('red-border');
                } else {
                    $('#amount-box' + idx).removeClass('red-border');
                    product.amount = amount;
                    if($sessionStorage.kitConfiguration == null) {
                        // if the kit is currently empty, start a new kit
                        $sessionStorage.kitConfiguration = [product];
                        $sessionStorage.clicked = [product.id];
                    } else {
                        // append current items onto the kit
                        $sessionStorage.kitConfiguration.push(product);
                        $sessionStorage.clicked.push(product.id);
                    }
                }
            };
        }
    };
}]);
