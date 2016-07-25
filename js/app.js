var app = angular.module('SlacklinePicker', [
    'ngRoute',
    'QuickList',
    'ngStorage',
    'ngScrollbars',
    'ngModal',
    'angular-clipboard',
    'smart-table'
]);

app.config(['$sessionStorageProvider', '$routeProvider', function($sessionStorageProvider, $routeProvider) {
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
