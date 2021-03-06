app.controller('AddItemController', ['$scope', '$filter', 'products', '$routeParams',
'$sessionStorage', '$rootScope', '$window', '$timeout', function($scope, $filter, products, $routeParams,
$sessionStorage, $rootScope, $window, $timeout) {
    // load data to be stored, and filter data based upon the filters passed

    $scope.loaded = false;
    products.success(function(data) {
        $scope.lproducts = data;
        $scope.lproducts = $filter('filter')($scope.lproducts, $scope.filters);
        $scope.loaded = true;
    });

    $scope.euroFilter = false;

    // hard coded catagories for the add item page
    $scope.api_categories = [
        {
            name: 'hardware',
            subcategories: ['ascenders', 'carabiners', 'pulleys', 'quicklinks', 'rings',
            'shackles', 'brakes', 'rigging_plates', 'weblocks','linegrabs',
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
            scrollAmount: 50
        },
        advanced:{
            updateOnContentResize: true
        },
        scrollInertia: 0
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

    $scope.categoryLoader = function(url) {
        if($window.location.hash === '#/additem/' + url)
            return
        $rootScope.$broadcast('loader_show');
        $timeout(function() {
            $window.location.href = '#/additem/' + url;
        })
    }

    $scope.subcategoryLoader = function(url, suburl) {
        if($window.location.hash === '#/additem/' + url + '/' + suburl)
            return
        $rootScope.$broadcast('loader_show');
        $timeout(function() {
            $window.location.href = '#/additem/' + url + '/' + suburl;
        })
    }

    // if the controller was entered with a route (e.g. #/additem/HARDWARE)
    if($routeParams.category != null) {
        // show the subcategory menu
        $('#dropdown-subcategory').show();
        if($routeParams.subcategory == null) {
            // if no subcategory was selected, only filter by category

            $('#dropdown-button-main').html(capitalizeRoutes($routeParams.category) + ' <span class="caret"></span></button>');
            $scope.filters = {category : $routeParams.category}
        } else {
            // filter by both category and subcategory
            $('#dropdown-button-main').html(capitalizeRoutes($routeParams.category) + ' <span class="caret"></span></button>');
            $('#dropdown-button-sub').html(capitalizeRoutes($routeParams.subcategory) + ' <span class="caret"></span></button>');
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

    // hide the loading icon currently spinning on the page
    $rootScope.$broadcast('loader_hide');
}]);
