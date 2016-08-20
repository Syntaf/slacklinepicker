var app = angular.module('SlacklinePicker', [
    'ngRoute',
    'QuickList',
    'ngStorage',
    'ngScrollbars',
    'ngModal',
    'angular-clipboard',
    'smart-table'
]);

app.config(['$sessionStorageProvider', '$routeProvider', '$httpProvider',
function($sessionStorageProvider, $routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            controller: 'MainController',
            templateUrl: 'views/main.html'
        })
        .when('/public', {
            controller: 'PublicKitsController',
            templateUrl: 'views/kitviewer.html'
        })
        .when('/about', {
            controller: 'AboutController',
            templateUrl: 'views/about.html'
        })
        .when('/share/:configuration', {
            controller: 'MainController',
            templateUrl: 'views/main.html'
        })
        .when('/share/:configuration/:notes', {
            controller: 'MainController',
            templateUrl: 'views/main.html'
        })
        .when('/additem', {
            controller: 'AddItemController',
            templateUrl: 'views/add.html'
        })
        .when('/additem/:category', {
            controller: 'AddItemController',
            templateUrl: 'views/add.html'
        })
        .when('/additem/:category/:subcategory', {
            controller: 'AddItemController',
            templateUrl: 'views/add.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.filter('capitalize', function() {
    return function(input) {
        return input.replace('_', ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
});

app.filter('euro', function() {
    return function(input) {
        return (parseFloat(input) * 0.9).toFixed(3);
    }
})

app.filter('excludeDescription', ['$filter', function($filter) {
    return function(input, predicate) {
        searchValue = predicate['$'];
        var customPredicate = function(value, index, array) {
            if (typeof searchValue === 'undefined') {
                return true;
            }

            var p0 = value['name'].toLowerCase().indexOf(searchValue.toLowerCase());
            var p1 = value['producer'].toLowerCase().indexOf(searchValue.toLowerCase());
            if(p0 > -1 || p1 > -1) {
                return true;
            } else {
                return false;
            }
        }

        return $filter('filter')(input, customPredicate, false);
    }
}]);
