app.factory('products', ['$http', function($http) {
    return {
        query: function(category, subcategory="") {
            var query_string = "";
            if(subcategory !== "") {
                query_string = "/search?Category=" + category + "&Subcategory="
                    + subcategory;
            } else {
                query_string = "/search?Category=" + category;
            }

            console.log(query_string);

            return $http.get(
                'https://sheetsu.com/apis/v1.0/590d2a3b404b' + query_string)
                .success(function(data) {
                    return data;
                })
                .error(function(err) {
                    return err;
                });

        }
    };
}]);
