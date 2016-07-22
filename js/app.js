var app = angular.module('SlacklinePicker', ['ngRoute', 'QuickList', 'ngStorage']);

app.config(['$sessionStorageProvider', '$routeProvider', function($sessionStorageProvider, $routeProvider) {
    $routeProvider
        .when('/', {
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

app.value('currentKit', []);

app.filter('capitalize', function() {
    return function(input) {
        return input.replace('_', ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
});
