app.factory('products', ['$http', function($http) {
    return {
        query: function(category, subcategory="") {
            var query_string = "";
            if(subcategory !== "") {
                query_string = "/search?category=" + category + "&subcategory="
                    + subcategory;
            } else {
                query_string = "/search?category=" + category;
            }

            console.log(query_string);

            return $http.get(
                'https://sheetsu.com/apis/v1.0/590d2a3b404b' + query_string)
                .success(function(data) {
                    $('#spinner').hide();
                    return data;
                })
                .error(function(err) {
                    $('#spinner').hide();
                    return err;
                });

        }
    };
}]);
