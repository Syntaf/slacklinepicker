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

        $scope.viewAsShareable = true;
        // the route supplied after share/ is simply a list of '-' sep parts
        $scope.productListById = parseHook($routeParams.configuration);

        // TODO: improve error detection capabilities
        // if parsing returned an error, return to main page
        if($scope.productListById === 'ERROR') {
            $window.location.href = '#/';
        }

        // asychronously grab product data from API
        products.success(function(data) {
            $scope.lproducts = data;

            // TODO: ID's correspond to array locations, do that instead?
            // set the kit to all products mentioned in the route string
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

        // if additional url exists, it means the kit also contains notes
        if($routeParams.notes != null) {
            // asychronously grab notes data
            notes.success(function (data) {
                data.forEach(function(x) {
                    // find matching uniqueID and set rawnotes
                    if(x.id === $routeParams.notes) {
                        $scope.notes = JSON.parse(x.rawnotes);
                    }
                });

                $scope.kit.forEach(function(kitItem) {
                    console.log('kitItem: ' + kitItem.id)
                    $scope.notes.forEach(function(note) {
                        console.log('note: ' + note.id);
                        if(kitItem.id == note.id) {
                            console.log('in!');
                            kitItem.notes = note.notes;
                        }
                    });
                });

                console.log($scope.kit);

                $scope.showReadOnlyNotes = function(id) {
                    $scope.addNotesChecker = true;
                    $scope.kit.forEach(function(x) {
                        if(x.id == id) {
                            if(x.notes != null) {
                                $('#notes').val(x.notes);
                                $('#notes').prop('readonly', true);
                            }
                        }
                    })
                }
            });


        }
    } else {
        /*
         *  -- Main App Section --
         *  If a user visits the webpage normalling, this is the section
         *  entered.
        */

        // set the kit to the current sessions kit (incase user refreshed page)
        $scope.kit = $sessionStorage.kitConfiguration;
        if($scope.kit != null) {
            // if the kit exists, recalculate the total price of the config
            $scope.kit.forEach(function(data) {
                $scope.total += data.price * data.amount;
            })
        }

        $scope.wipeKit = function() {
            // when 'New Kit' is clicked, this function is ran
            $sessionStorage.$reset();
            $scope.kit = null;
            $scope.total = 0;
        }

        $scope.removeItem = function(id) {
            // called when the trash glyphicon is clicked for an item. filter
            // out item with that matching ID first
            $sessionStorage.kitConfiguration =
            $.grep($sessionStorage.kitConfiguration, function(e) {
                if(e.id == id) {
                    $scope.total -= e.price * e.amount;
                }
                return e.id != id;
            });

            // remove item from stored list of added items, so the check does
            // not appear for it's name in the database
            $sessionStorage.clicked =
            $.grep($sessionStorage.clicked, function(e) {
                return e != id;
            });

            // set kit to the new kit configuration
            $scope.kit = $sessionStorage.kitConfiguration;
        }

        $scope.generateShareableHook = function() {

            $scope.sharePublic = false;

            // Called when a user attempts to share their configuration
            if($scope.kit == null) return;

            // generate a link by creating a '-' separated string of id's
            $scope.link = "";
            $scope.kit.forEach(function(product) {
                $scope.link += product.id;
                if(product.amount > 1) {
                    $scope.link += '&' + product.amount;
                }
                $scope.link += '-';
            });

            // remove last '-' because I'm a bad programmer and dunno how
            // to avoid adding that last dash
            $scope.link = $scope.link.slice(0, -1);

            // if the containsNotes variable was set, that means we need to
            // push these notes to our sheetsu API
            if($sessionStorage.kitContainsNotes) {
                // TODO: if user is only updating notes, do not POST an entire
                // new ID and entry. This wastes our limited API calls to sheetsu

                // generate random ID, and save any objects with notes
                var uniqueId = makeId();
                var notesObject = [];
                $sessionStorage.kitConfiguration.forEach(function(x) {
                    if(x.notes != null) {
                        notesObject.push({id: x.id, notes: x.notes});
                    }
                });

                $scope.link += '/' + uniqueId;

                // TODO: re-enable!
                /*
                // ajax call to post data to spreadsheet
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
                */
            }

            // TODO: changed rawLink to be SITE_ADDRESS + link, site address
            // can just be hard coded
            $scope.rawLink = 'www.slacklinepicker.com/#/share/' + $scope.link;

            // procs ngModal to open window containing link
            $scope.shareLink = true;
        }


        $scope.showCopiedLabel = function () {
            // when the 'copy to clipboard' label is clicked, this will make the label
            // appear.
            $('#show-copied').css('display','inline-block').delay(1500).fadeOut();
        }

        $scope.toggleNotes = function(id) {
            // shows notes to user, and if view is in shareable mode it does now allow
            // allow the input box to be modified
            $scope.addNotesChecker = true;
            $scope.notesId = id;
            $sessionStorage.kitConfiguration.forEach(function(x) {
                if(x.id == id) {
                    if(x.notes != null) {
                        $('#notes').val(x.notes);
                    }
                }
            });
        }

        $scope.saveNotes = function() {
            // when the notes modal is exited, this function is called which saves notes
            $sessionStorage.kitConfiguration.forEach(function(x) {
                if(x.id == $scope.notesId) {
                    // save any notes
                    if(x.notes == null) {
                        if($('#notes').val() === '')
                            return;
                        x.notes = $('#notes').val();
                    } else if (x.notes != $('#notes').val()) {
                        x.notes = $('#notes').val();
                    }

                    $sessionStorage.kitContainsNotes = true;
                }
            });
            $('#notes').val('');
        }

        $scope.togglePublicKit = function () {
            if($sessionStorage.submitKitPublicy == null) {
                $sessionStorage.submitKitPublicy = true;
            } else {
                $sessionStorage.submitKitPublicly = !$sessionStorage.submitKitPublicly;
            }
        }

        $scope.publicBoxIsChecked = function() {
            return $sessionStorage.submitKitPublicly;
        }
    }
}]);
