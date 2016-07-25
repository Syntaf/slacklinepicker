app.controller('PublicKitsController', ['$scope', 'builds', function($scope, builds) {
    // needed for configuring the database scrollbar
    $scope.scrollbarConfig = {
        autoHideScrollbar: false,
        theme: 'light',
        mouseWheel: {
            scrollAmount: 300
        },
        advanced:{
            updateOnContentResize: true
        },
        scrollInertia: 900
    };

    builds.success(function(data) {
        $scope.buildList = data;
        $scope.doneLoad = true;
    });

}]);
