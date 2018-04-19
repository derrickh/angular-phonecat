'use strict';

angular.
module('brackCrackApp').
component('bracket', {
    templateUrl: 'components/bracket/bracket.template.html',
    controller: function BracketCompController($scope, $routeParams, DataService) {

        DataService.getBracket($routeParams.bracketId)
            .then(function (response) {
                $scope.bracket = response;
                $scope.isOwner = $scope.bracket.createdBy == $scope.currentUser.uid;
                console.log($scope.bracket.createdBy + ' : ' + $scope.currentUser.uid);
            })
            .catch(function (err) {
                throw new Error(err);
            })

        $scope.getMatchUps = function (matchUps) {
            var matchUpArray = [];
            for (var x = 16; x > 0; x--) {
                var matchUp = matchUps[x + "M"];
                if (matchUp) {
                    matchUpArray.push(matchUp);
                }
            }
            return matchUpArray;
        }

        $scope.getRounds = function (rounds) {
            if (!rounds) {
                return;
            }

            var roundsArray = [];
            for (var x = 5; x > 0; x--) {
                var round = rounds['round' + x];
                if (round) {
                    roundsArray.push(round);
                }
            }
            return roundsArray;
        }
    },
    bindings: {
        bracketId: '<'
    }
});
