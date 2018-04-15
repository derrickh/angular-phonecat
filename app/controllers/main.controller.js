'use strict';

angular.module('brackCrackApp')
    .controller('MainController', function ($scope, $firebaseAuth, $timeout, $location, FIREBASE_URL) {
        $scope.currentUser = null;
        $scope.doneLoading = false;
        $scope.activeTab = $location.path();

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        }

        firebase.auth().onAuthStateChanged(function (user) {
            $scope.setCurrentUser(user);
        });

        $scope.showError = function (error) {
            $scope.showErrorAlert = true;
            $scope.errorTextAlert = error.code + ": " + error.message;
        }

        $scope.showInfo = function (message) {
            $scope.showInfo = true;
            $scope.infoText = message;
        }

        $scope.showSuccess = function (message) {
            $scope.showSuccess = true;
            $scope.successText = message;
        }

        $scope.refreshUser = function () {
            console.log(JSON.stringify($scope.currentUser));
        }

        $scope.isActiveTab = function (tabName) {
            return $scope.activeTab == tabName;
        }

        $scope.navBarClick = function (activeTab) {
            $scope.activeTab = activeTab;
        }

        $scope.emailLogin = function (email, pass) {
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                $scope.showError(error);
            });
        }

        $scope.googleLogin = function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                $scope.setCurrentUser(result.user);
                $scope.apiToken = result.credential.accessToken;
            }).catch(function (error) {
                $scope.showError(error);
            });
        }

        $scope.facebookSignIn = function () {
            var provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                $scope.setCurrentUser(result.user);
                $scope.apiToken = result.credential.accessToken;
            }).catch(function (error) {
                $scope.showError(error);
            });
        };

        $scope.twitterSignIn = function () {
            var provider = new firebase.auth.TwitterAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                $scope.setCurrentUser(result.user);
                $scope.apiToken = result.credential.accessToken;
            }).catch(function (error) {
                $scope.showError(error);
            });
        };

        $scope.resetPassword = function () {
            $scope.authObj.$resetPassword({
                email: "my@email.com"
            }).then(function () {
                $scope.showInfo("Password reset email sent");
            }).catch(function (error) {
                $scope.showError(error);
            });
        }

        $scope.signOut = function () {
            firebase.auth().signOut().then(function () {
                $scope.setCurrentUser(null);
                $location.path("/signIn");
            }).catch(function (error) {
                $scope.showError(error);
            });
        }

        $scope.createAccount = function (email, password) {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                $scope.showError(error);
            });
        }

        $timeout(function () {
            $scope.doneLoading = true;
            if ($scope.currentUser == null) {
                $scope.activeTab = '';
                $location.path("/signIn");
            }
        }, 2000);
    });
