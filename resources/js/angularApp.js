var mymodal = angular.module('mymodal', ['angular.step']);

/*
 * app.js
 * An example app that uses the angularjs step.
 */

//var app = angular.module('testStep', ['angular.step']);

mymodal.run(function ($rootScope) {
    $rootScope.submitNewMixNg = function () {
        submitNewMix();
    };
    $rootScope.submitNewSongNg = function () {
        submitNewSong();
    };
});

mymodal.controller('MainCtrl', function ($scope) {
    $scope.showSongModal = false;
    $scope.showArtistModal = false;
    $scope.showMixModal = false;
    $scope.loginMixModal = false;
    $scope.showNewSongModal = false;


    $scope.toggleSongModal = function(){
        $scope.showSongModal = !$scope.showSongModal;
    };
    $scope.toggleArtistModal = function(){
        $scope.showArtistModal = !$scope.showArtistModal;
    };
    $scope.toggleMixModal = function(){
        $scope.showMixModal = !$scope.showMixModal;
    };
    $scope.toggleLoginModal = function(){
        $scope.showLoginModal = !$scope.showLoginModal;
    };
    $scope.toggleSignupModal = function(){
        $scope.showSignupModal = !$scope.showSignupModal;
    };
    $scope.toggleNewSongModal = function(){
        $scope.showNewSongModal = !$scope.showNewSongModal;
    };
});

mymodal.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };   
  });

function submitNewMix() {
    var mixData = $('#addNewMixForm').serializeObject();

    $.ajax({
        url : "http://localhost:3000/songName/" + mixData.nextSong
    }).then(function(data) {
        mixData.nextSong = data[0]._id;
        insertMix(mixData);
    });
}

function insertMix(mixData){

    var parsedMixData = {nextSong: mixData.nextSong,
        comments: mixData.comments,
        rating: mixData.rating
    }

    $.ajax({
        url: 'http://localhost:3000/mix/',
        type: 'post',
        dataType: 'json',
        data: parsedMixData,
        success: function(data) {
            searchSongId(mixData.songName, data._id);
        }
    });
    return false;
}

function searchSongId(songName, mixId){
    $.ajax({
        url : "http://localhost:3000/songName/" + songName
    }).then(function(data) {
        insertMixIntoSong(data[0]._id, mixId);
    });
}

function insertMixIntoSong(songId, mixId){

    var data = {songMixs: mixId}
    $.ajax({
        url: 'http://localhost:3000/addMix/' + songId,
        type: 'put',
        dataType: 'json',
        data: data,
        success: function(data) {
            alert("Success");
        }
    });
    return false;
}


function submitNewSong(){

    var songData = $('#addNewSongForm').serializeObject();

    $.ajax({
        url : "http://localhost:3000/artistName/" + songData.songArtist
    }).then(function(data) {
        songData.songArtist = data[0]._id;
        insertSong(songData);
    });
}

function insertSong(songData){
    $.ajax({
        url: 'http://localhost:3000/song/',
        type: 'post',
        dataType: 'json',
        data: songData,
        success: function(data) {
            alert("Success");
            defineNames();
        }
    });
    return false;
}

/**
 * @ngdoc overview
 * @name angular-step
 *
 * @description
 * An AngularJS way of building clean "wizard" like applications.
 */

angular.module('angular.step', [])

    .controller('StepSetController', ['$scope', function ($scope) {

        var ctrl = this,
            index = -1, // points to the current step in the steps array
            steps = ctrl.steps = $scope.steps = [];

        $scope.nextEnabled = true;
        $scope.previousEnabled = false;
        $scope.submitEnabled = false;

        /*
         * Moves to the next step
         */
        $scope.next = function () {
            if (steps.length === 0) {
                console.debug('No steps provided.');
                return;
            }
            // If we're at the last step, then stay there.
            if (index == steps.length - 1) {
                console.debug('At last step.');
                return;
            }
            if($('#songName1').val().length > 0 ){
                excludeMixMatches($('#songName1').val());
            }

            steps[index++].isDisplayed = false;
            steps[index].isDisplayed = true;

            ctrl.setButtons();
        }; // $scope.next

        /*
         * Moves to the previous step
         */
        $scope.previous = function () {
            if (steps.length === 0) {
                console.debug('No steps provided.');
                return;
            }

            if (index === 0) {
                console.debug('At first step');
                return;
            }
            steps[index--].isDisplayed = false;
            steps[index].isDisplayed = true;
            ctrl.setButtons();
        }; // $scope.previous

        $scope.submit = function () {
            $scope.submitAction();
        };

        /*
         * Adds a step to the end of the step list and
         * sets the index to 0 if it's the first step added.
         */
        ctrl.addStep = function (obj) {
            ctrl.steps.push(obj);
            if (index == -1) {
                index = 0;
                steps[0].isDisplayed = true;
            }
        };

        /*
         * Sets the correct buttons to be enabled or disabled.
         */
        ctrl.setButtons = function () {
            if (index == steps.length - 1) {
                $scope.nextEnabled = false;
                $scope.submitEnabled = true;
            } else if (index === 0) {
                $scope.previousEnabled = false;
            } else {
                $scope.nextEnabled = true;
                $scope.previousEnabled = true;
                $scope.submitEnabled = false;
            }
        };

    }])

/**
 * @ngdoc directive
 * @name stepset
 * @restrict EA TODO: This may or may not be correct.
 *
 * @description
 * Stepset is the outer container for a set of ordered steps.
 * @example
 * TODO: Put example here.
 */.directive('stepset', function () {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                nextText: '@',
                previousText: '@',
                submitText: '@',
                submitAction: '='
            },
            controller: 'StepSetController',
            templateUrl: 'partials/stepset.html',
            link: function (scope, element, attrs) {
                // TODO put link related things here.
            }
        };
    })


/**
 * @ngdoc directive
 * @name step
 * @restrict EA TODO: this may or may not be correct
 *
 * @description
 * A Step is a single item that is displayed in the step set.
 * @example
 * TODO: put example here.
 */.directive('step', ['$parse', function ($parse) {
        var d = this;
        return {
            require: '^stepset',
            restrict: 'EA', // TODO: see above
            replace: true,
            templateUrl: 'partials/step.html',
            transclude: true,
            scope: {
                title: '@',
                description: '@'
            },
            controller: function ($scope) {
                // Determines if it should be displayed.  The stepset directive
                // controller needs to make sure only one shows up at a time.
                $scope.isDisplayed = false;
            },
            compile: function (elm, attrs, transclude) {
                return function postLink(scope, elm, attrs, ctrl) {
                    ctrl.addStep(scope);
                };
            }
        };
    }])

;