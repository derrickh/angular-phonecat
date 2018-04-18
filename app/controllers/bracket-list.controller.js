'use strict';

angular.module('brackCrackApp')
    .controller('BracketListController', ["$scope", "$filter", "$location", "$firebase", "DataService", function ($scope, $filter, $location, $firebase, DataService) {
        $scope.actionClicked = false;
        $scope.bracketList = [];

        $scope.openBracket = function (row) {
            if (!$scope.actionClicked) {
                $scope.activeBracket = row.id;
                $location.path("/bracket/" + $scope.activeBracket);
            }
            $scope.actionClicked = false;
        }

        $scope.shareBracket = function (bracketId) {
            $scope.actionClicked = true;
            alert('share bracket: ' + bracketId);
        }

        $scope.printBracket = function (bracketId) {
            $scope.actionClicked = true;
            alert('print bracket: ' + bracketId);
        }

        $scope.deleteBracket = function (bracketId) {
            $scope.actionClicked = true;
            alert('delete bracket: ' + bracketId);
        }

        $scope.findBracket = function (bracketId) {
            angular.forEach($scope.bracketList, function (value) {
                if (value.id == bracketId) {
                    return value;
                }
            });
        }
        
        DataService.getBracketList()
            .then(function (response) {
                $scope.bracketList = response;
            })
            .catch(function (err) {
                throw new Error(err);
            })

        $scope.createNewBracket = function () {
            $location.path("/create");
        }
    }]);
