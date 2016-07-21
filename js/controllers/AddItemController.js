app.controller('AddItemController', ['$scope', '$filter', 'products', '$routeParams',
function($scope, $filter, products, $routeParams) {

    // hard coded catagories for the add item page
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

    // the following code will take the hooks above, and convert them into
    // a format that can be put into labels so the user see's a 'pretty'
    // version of the hook
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

    // if the controller was entered with a route (e.g. #/additem/HARDWARE)
    if($routeParams.category != null) {
        // show the subcategory menu
        $('#dropdown-subcategory').show();
        if($routeParams.subcategory == null) {
            // if no subcategory was selected, only filter by category
            $scope.filters = {category : $routeParams.category}
        } else {
            // filter by both category and subcategory
            $scope.filters = {
                category : $routeParams.category,
                subcategory: $routeParams.subcategory
            };
        }
        // find the current category and set the vars used to populate the
        // subcategory dropdown menu
        for(var i = 0; i < $scope.api_categories.length; i++) {
            if($scope.api_categories[i].name === $routeParams.category) {
                $scope.currentCategory = $scope.api_categories[i];
                $scope.prettyCurrentCategories = $scope.pretty_categories[i];
            }
        }
    }

    // load data to be stored, and filter data based upon the filters passed
    products.success(function(data) {
        $scope.lproducts = data;
        $scope.lproducts = $filter('filter')($scope.lproducts, $scope.filters);
    });


}]);
