app.factory('products', ['$http', function($http) {
        return $http.get(
            'https://gist.githubusercontent.com/Syntaf/aaeda8682a39928daf038cab746c392a/raw/306db76def98ba63f41acd1bd4e9d101df7cc9a0/betaproducts.json')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
