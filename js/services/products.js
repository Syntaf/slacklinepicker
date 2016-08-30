app.factory('products', ['$http', function($http) {
        return $http.get(
            'https://gist.githubusercontent.com/Syntaf/aaeda8682a39928daf038cab746c392a/raw/6237edac20d4cbc8ae78ebe96eea638eac3c38e2/betaproducts.json')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
