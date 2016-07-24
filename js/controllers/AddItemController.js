app.controller('AddItemController', ['$scope', '$filter', 'products', '$routeParams',
'$sessionStorage', function($scope, $filter, products, $routeParams, $sessionStorage) {
    // load data to be stored, and filter data based upon the filters passed
    products.success(function(data) {
        $scope.lproducts = data;
        $scope.lproducts = $filter('filter')($scope.lproducts, $scope.filters);
    });

    // hard coded catagories for the add item page
    $scope.api_categories = [
        {
            name: 'hardware',
            subcategories: ['ascenders', 'pulleys', 'quicklinks', 'rings',
            'shackles', 'brakes', 'rigging_plates', 'webbing_anchors','linegrabs',
            'misc']
        },
        {
            name: 'webbing',
            subcategories: ['high_stretch', 'mid_stretch', 'low_stretch', 'misc']
        },
        {
            name: 'accessories',
            subcategories: ['highline', 'slings', 'rope', 'bag', 'protection', 'misc']
        }
    ];

    // needed for configuring the database scrollbar
    $scope.scrollbarConfig = {
        autoHideScrollbar: false,
        theme: 'light',
        mouseWheel: {
            scrollAmount: 300
        },
        advanced:{
            updateOnContentResize: true
        },
        scrollInertia: 900
    };

    // array to keep track of what items have been selected for the kit builder
    $scope.isClicked = function(idx) {
        if($.inArray
            (idx, $sessionStorage.clicked) != -1) {
            return true;
        } else {
            return false;
        }
    };

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
            }
        }
    }
}]);
