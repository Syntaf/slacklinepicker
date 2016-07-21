app.factory('products', ['$http', function($http) {
        return $http.get(
            'https://gist.githubusercontent.com/Syntaf/4c6704cbf128228ff50bdb2fd22c825c/raw/9fd1b02e9d828aa0e75796502b77de907732893c/slacklineproducts.json')
            .success(function(data) {
                $('#spinner').hide();
                return data;
            })
            .error(function(err) {
                $('#spinner').hide();
                return err;
            });
}]);
