'use strict';

angular.module('brackCrackApp')
    .factory('DataService', function ($firebaseArray, $firebaseObject, $q) {
        var dataService = {};

        dataService.getBracketList = function () {
            var deferred = $q.defer();
            var brackets = firebase.database().ref('brackets');
            var list = $firebaseArray(brackets);
            list.$loaded().then(function (bracketList) {
                deferred.resolve(bracketList);
            });
            return deferred.promise;
        };

        dataService.getBracket = function (bracketId) {
            var deferred = $q.defer();
            var brackets = firebase.database().ref('brackets/' + bracketId);
            var obj = $firebaseObject(brackets);
            obj.$loaded().then(function () {
                deferred.resolve(obj);
            });
            return deferred.promise;
        }

        dataService.addBracket = function (bracket) {
            if(firebase.auth().currentUser.uid != bracket.createdBy) {
                return null;
            }
            
            bracket.createdOn = new Date();
            
            var newPostKey = firebase.database().ref().child('brackets').push().key;
            bracket.id = newPostKey;
            var updates = {};
            updates['/brackets/' + newPostKey] = bracket;
            return firebase.database().ref().update(updates);
        }

        dataService.getEmptyBracketRounds = function () {
            var deferred = $q.defer();
            var rounds = firebase.database().ref('rounds');
            var fbArray = $firebaseObject(rounds);
            fbArray.$loaded().then(function (list) {
                deferred.resolve(list);
            });
            return deferred.promise;
        }

        dataService.getSeedList = function (seedCount) {
            var deferred = $q.defer();
            var seeds = firebase.database().ref('seedList/' + seedCount + 'Seed');
            var fbArray = $firebaseObject(seeds);
            fbArray.$loaded().then(function (list) {
                deferred.resolve(list);
            });
            return deferred.promise;
        }

        return dataService;
    });
