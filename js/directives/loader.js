app.directive("loader", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return element.append('<div class="loader"></div>');
        });
        return $scope.$on("loader_hide", function () {
            return $('.loader').fadeOut(function() {
                $(this).remove();
            });
        });
    };
})
