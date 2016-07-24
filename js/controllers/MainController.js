app.controller('MainController', ['$scope', 'products', '$sessionStorage',
'$routeParams', '$window', '$http', '$httpParamSerializer', 'notes',
 function($scope, products, $sessionStorage, $routeParams, $window, $http,
 $httpParamSerializer, notes) {

    $scope.total = 0;

    if($routeParams.configuration != null) {
        /*
        *  -- Shareable section --
        *  This section is entered if a user uses a shareable link
        *  to view someone else's configuration
        */
        $scope.freeze = true;
        $scope.productListById =
            parseHook($routeParams.configuration);

        if($scope.productListById === 'ERROR') {
            $window.location.href = '#/';
        }

        products.success(function(data) {
            $scope.lproducts = data;

            $scope.kit = $.grep($scope.lproducts, function(e) {
                var found = false;
                $scope.productListById.forEach(function(x) {
                    if(x.id == e.id) {
                        e.amount = x.amount;
                        $scope.total += e.price * e.amount;
                        found = true;
                    }
                });
                return found;
            });
        });

        // if additional url exists, we know there are notes
        if($routeParams.notes != null) {
            notes.success(function (data) {
                data.forEach(function(x) {
                    if(x.id === $routeParams.notes) {
                        $scope.rawNotes = x.rawnotes;
                    }
                });

                $scope.notes = JSON.parse($scope.rawNotes);

                console.log($scope.notes);
            });
        }
    } else {
        /*
         *  -- Main App Section --
         *  If a user visits the webpage normalling, this is the section
         *  entered.
        */
        $scope.kit = $sessionStorage.kitConfiguration;
        if($scope.kit != null) {
            $scope.kit.forEach(function(data) {
                $scope.total += data.price * data.amount;
            })
        }
        $scope.wipeKit = function() {
            $sessionStorage.$reset();
            $scope.kit = null;
            $scope.total = 0;
        }

        $scope.removeItem = function(id) {
            $sessionStorage.kitConfiguration =
            $.grep($sessionStorage.kitConfiguration, function(e) {
                if(e.id == id) {
                    $scope.total -= e.price * e.amount;
                }
                return e.id != id;
            });

            $sessionStorage.clicked =
            $.grep($sessionStorage.clicked, function(e) {
                return e != id;
            });

            $scope.kit = $sessionStorage.kitConfiguration;
        }

        $scope.generateShareableHook = function() {
            if($scope.kit == null) return;
            $scope.link = "";
            $scope.kit.forEach(function(product) {
                $scope.link += product.id;
                if(product.amount > 1) {
                    $scope.link += '&' + product.amount;
                }
                $scope.link += '-';
            });
            $scope.link = $scope.link.slice(0, -1);
            $scope.rawLink = $window.location.hostname + '/' +
                $window.location.hash + $scope.link;
            if($sessionStorage.kitContainsNotes) {
                var uniqueId = makeId();
                var notesObject = [];
                $sessionStorage.kitConfiguration.forEach(function(x) {
                    if(x.notes != null) {
                        notesObject.push({id: x.id, notes: x.notes});
                    }
                });
                console.log($httpParamSerializer({id: uniqueId, rawnotes: notesObject}));
                $.ajax({
                    url: 'https://sheetsu.com/apis/v1.0/d9acf6c52e0b',
                    data: $httpParamSerializer({id: uniqueId, rawnotes: JSON.stringify(notesObject)}),
                    dataType: 'json',
                    type: 'POST',
                    success: function(data) {
                        console.log('Success!');
                    },
                    error: function(data) {
                        console.log(data);
                    }
                });
            }
            $scope.shareLink = true;
        }

        $scope.showCopiedLabel = function () {
            $('#show-copied').css('display','inline-block').delay(1500).fadeOut();
        }

        $scope.toggleNotes = function(id, idx) {
            $scope.addNotesChecker = true;
            $scope.notesId = id;
            var notes = $sessionStorage.kitConfiguration[idx].notes;
            if( notes != null) {
                $('#notes').val(notes)
            }
        }

        $scope.saveNotes = function() {
            if($('#notes').val() == '') return;
            $sessionStorage.kitConfiguration.forEach(function(x) {
                if(x.id == $scope.notesId) {
                    x.notes = $('#notes').val();
                    $sessionStorage.kitContainsNotes = true;
                }
            });
            $('#notes').val('');
        }
    }
}]);
