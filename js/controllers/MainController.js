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
         *
         *  LOCAL VARIABLE LIST
         *  $scope.viewAsShareable: If set to true, the main.html will
         *      change the view of the screen to create a 'read-only' view.
         *      This way a user won't be able to modify a build they've been
         *      given as a shareable link
         *  $scope.productListById: Result of parsing the split up product list
         *      that was passed as a route.
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
                    $scope.notes.forEach(function(note) {
                        if(kitItem.id == note.id) {
                            kitItem.notes = note.notes;
                        }
                    });
                });

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
         *
         *  LOCAL VARIABLE LIST
         *  $scope.sharePublic: If the 'share public' checkbox within the share modal
         *      is clicked, this will be true. Otherwise it will be false. Used to
         *      determine whether the form should be displayed below the shared links
         *  $scope.kit: Holds the current kit configuration that should be displayed
         *      to the user. Always a copy of $sessionStorage.kitConfiguration since
         *      the kit is designed to live beyond a simple refresh.
         *  $scope.wipeKit: function which wipes all data related to the current kit.
         *      called by the html element `create-new` upon ng-click
         *  $scope.removeItem: when the trash glyphicon is clicked, ng-click will called
         *      this function to remove the item from $scope.kit, $sessionStorage.kitConfiguration
         *      , and $sessionStorage.clicked
         *  $scope.generateShareableHook: when the html element 'share-this' is clicked, ng-click
         *      will proc this function which generates a link for the current kit that can be
         *      shared with other users. uses sheetsu API to post note information if it exists
             *  $scope.link: contains the shareable link generated for the user. First part
             *      of the link will contain a '-' separated list of part ID's, and if notes
             *      exist a uniqueID will be generated and added onto that list so notes can
             *      be retreived from the noteAPI.
             *  $scope.rawLink: hard coded host address plus the link, used for displaying
             *  $scope.shareLink: set to true at the end of the generateShareableHook function
             *      so that the share modal will open and display the link for the user
         *  $scope.showCopiedLabel: When the user clicks the 'copy to clipboard' button,
         *      this function will display a 'Copied!' label then fade it out
         *  $scope.toggleNotes: when a user clicks on either 'Add Notes' or 'Show Notes',
         *      this function will proc and display the notes.
             *  $scope.addNotesChecker: tells the notes modal to open when set to true
             *  $scope.notesId: lets the function know which ID to store/show the notes for
         *  $scope.saveNotes: upon the modal exiting, this function will save any notes
         *      within the input box if they differ from the current notes.
             *  $sessionStorage.kitContainsNotes: if any notes have been saved, we want to
                    generate a shareable link to them by posting to the NoteAPI when creating
                    a shareable link. If no notes exist, we don't need to waste an API call
                    and this will remain false.
         *  $scope.togglePublicKit: when the checkbox is clicked for sharing publicly, this
                will toggle the box on/off
             *  $sessionStorage.submitKitPublicly: we need the decision to submit publicly to last
                    an entire session and not just a single page instance.
         *  $scope.publicBoxIsChecked: returns value of $sessionStorage.submitKitPublicly
        */

        // set the kit to the current sessions kit (incase user refreshed page)
        $scope.sharePublic = false;
        $scope.kit = $sessionStorage.kitConfiguration;
        $scope.currentKitName = $sessionStorage.currentKitName;
        $scope.currentKitAuthor = $sessionStorage.currentKitAuthor;
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
            $sessionStorage.submitKitPublicly = !$sessionStorage.submitKitPublicly;
        }

        $scope.publicBoxIsChecked = function() {
            return $sessionStorage.submitKitPublicly;
        }

        $scope.checkSharePublic = function() {
            if(!$scope.publicBoxIsChecked)
                return;


            var kitName = $('#name').val();
            var kitAuthor = $('#author').val();
            var kitCost = $scope.total;

            if(!$sessionStorage.kitMadePublic) {
                $sessionStorage.publicKitHash = makeId();
                var buildApiObject = {
                    'hash': $sessionStorage.publicKitHash,
                    'name': kitName,
                    'cost': kitCost,
                    'author': kitAuthor,
                    'link': $scope.rawLink
                };

                // ajax call to post data to spreadsheet
                $.ajax({
                    url: 'https://sheetsu.com/apis/v1.0/d9acf6c52e0b/sheets/BuildsAPI',
                    data: $httpParamSerializer(buildApiObject),
                    dataType: 'json',
                    type: 'POST',
                    success: function(data) {
                        console.log('Success!');
                    },
                    error: function(data) {
                        console.log(data);
                    }
                });

                $sessionStorage.kitMadePublic = true;
            } else {
                var buildApiObject = {
                    'name': kitName,
                    'cost': kitCost,
                    'author': kitAuthor,
                    'link': $scope.rawLink
                };

                var url = 'https://sheetsu.com/apis/v1.0/d9acf6c52e0b/sheets/BuildsAPI'
                    + '/hash/' + $sessionStorage.publicKitHash;

                // ajax call to post data to spreadsheet
                $.ajax({
                    url: url,
                    data: $httpParamSerializer(buildApiObject),
                    dataType: 'json',
                    type: 'PATCH',
                    success: function(data) {
                        console.log('Success!');
                    },
                    error: function(data) {
                        console.log(data);
                    }
                });
            }

            $sessionStorage.currentKitName = kitName;
            $sessionStorage.currentKitAuthor = kitAuthor;
        }
    }
}]);
