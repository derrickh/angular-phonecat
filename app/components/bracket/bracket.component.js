'use strict';

angular.
module('brackCrackApp').
component('bracket', {
    templateUrl: 'components/bracket/bracket.template.html',
    controller: function BracketCompController($scope, $routeParams, DataService) {

        DataService.getBracket($routeParams.bracketId)
            .then(function (response) {
                $scope.bracket = response;
            })
            .catch(function (err) {
                throw new Error(err);
            })

        $scope.isOwner = true;
    },
    bindings: {
        bracketId: '<'
    }
});
