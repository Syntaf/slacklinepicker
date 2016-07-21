app.controller('AddItemController', ['$scope', 'products', '$routeParams', function($scope, products, $routeParams) {
    if($routeParams.category != null) {
        if($routeParams.subcategory == null) {
            products.query($routeParams.category).success(function(data) {
                $scope.lproducts = data;
                console.log('loaded!');
            });
        } else {
            products.query($routeParams.category, $routeParams.subcategory).success(function(data) {
                $scope.lproducts = data;
                console.log('loaded!');
            })
        }
    }

    $scope.api_categories = [
        {
            name: 'hardware',
            subcategories: ['ascenders', 'pulleys', 'quicklinks', 'rings',
            'shackles', 'brakes', 'rigging_plates', 'webbing_anchors','linegrabs']
        },
        {
            name: 'webbing',
            subcategories: ['high_stretch', 'mid_stretch', 'low_stretch', 'misc']
        },
        {
            name: 'accessories',
            subcategories: ['highline', 'slings', 'rope', 'bag']
        }
    ];

    $scope.pretty_categories = [];
    $scope.api_categories.forEach(function(obj) {
        var pcategory = obj.name[0].toUpperCase() + obj.name.substr(1);
        var psubcategories = [];
        obj.subcategories.forEach(function(sub) {
            psubcategories.push(
                sub.split('_').
                map(function(word) {
                    return word[0].toUpperCase() + word.substr(1);
                })
                .join(' ')
            );
        });
        $scope.pretty_categories.push(
            {
                name: pcategory,
                subcategories: psubcategories
            }
        );
    });
}]);
