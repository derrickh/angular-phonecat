angular.module('brackCrackApp')
    .controller('CreateController', function ($scope, $location, DataService) {
        $scope.newBracket = {};

        $scope.number = 16;
        $scope.getNumber = function (num) {
            return new Array(num);
        }

        $scope.add = function () {
            $scope.newBracket.createdBy = $scope.currentUser.uid;
            var bracket = $scope.newBracket;
            if (!bracket.teamList) {
                $scope.showError({
                    message: 'List of seeds is not populated'
                });
            }

            var valArray = bracket.teamList.split('\n');

            if (valArray.length != 4 && valArray.length != 8 && valArray.length != 16) {
                $scope.showError({
                    message: 'Something wrong with list after split: ' + bracket.teamList.length
                });

                return;
            }

            if (bracket.randomSeeding) {
                valArray = $scope.knuthShuffle(valArray);
            }

            var seedCount = valArray.length;
            DataService.getEmptyBracketRounds(seedCount)
                .then(function (rounds) {
                    DataService.getSeedList(seedCount)
                        .then(function (seeds) {
                            $scope.populateAndSaveNewBracket(bracket, valArray, rounds, seeds);
                        })
                        .catch(function (err) {
                            console.log('error: ' + err);
                            $scope.showError({
                                message: 'Error with seed retrieval'
                            });
                        })
                })
                .catch(function (err) {
                    console.log('error: ' + err);
                    $scope.showError({
                        message: 'Error with round retrieval'
                    });
                })
        }

        $scope.populateAndSaveNewBracket = function (bracket, teams, rounds, seeds) {
            if (!rounds || rounds.length == 0) {
                $scope.showError({
                    message: 'Something went wrong with rounds retrieval'
                });
                return;
            }

            if (!seeds || seeds.length == 0) {
                $scope.showError({
                    message: 'Something went wrong with seeds retrieval'
                });
            }

            var seedWithTeams = {};

            angular.forEach(teams, function (value, key) {
                var seed = key + 1;
                var seedWithTeam = {
                    seedId: seeds['seed' + seed],
                    id: seed,
                    name: value
                };
                seedWithTeams[seedWithTeam.id + 'Seed'] = seedWithTeam;
            });

            bracket.rounds = {};
            bracket.rounds.round1 = rounds['1Round'];
            bracket.rounds.round2 = rounds['2Round'];
            bracket.rounds.round3 = rounds['3Round'];

            if (bracket.format == "4") {
                var startingRound = rounds['3Round'];

                startingRound['3M'].top = seedWithTeams['1Seed'];
                startingRound['3M'].bottom = seedWithTeams['4Seed'];

                startingRound['4M'].top = seedWithTeams['3Seed'];
                startingRound['4M'].bottom = seedWithTeams['2Seed'];
            } else if (bracket.format == "8") {
                var startingRound = rounds['4Round'];

                startingRound['5M'].top = seedWithTeams['1Seed'];
                startingRound['5M'].bottom = seedWithTeams['8Seed'];

                startingRound['6M'].top = seedWithTeams['3Seed'];
                startingRound['6M'].bottom = seedWithTeams['6Seed'];

                startingRound['7M'].top = seedWithTeams['4Seed'];
                startingRound['7M'].bottom = seedWithTeams['5Seed'];

                startingRound['8M'].top = seedWithTeams['2Seed'];
                startingRound['8M'].bottom = seedWithTeams['7Seed'];

                bracket.rounds.round4 = rounds['4Round'];
            } else {
                var startingRound = rounds['5Round'];

                startingRound['9M'].top = seedWithTeams['1Seed'];
                startingRound['9M'].bottom = seedWithTeams['16Seed'];

                startingRound['10M'].top = seedWithTeams['9Seed'];
                startingRound['10M'].bottom = seedWithTeams['8Seed'];

                startingRound['11M'].top = seedWithTeams['5seed'];
                startingRound['11M'].bottom = seedWithTeams['12Seed'];

                startingRound['12M'].top = seedWithTeams['13Seed'];
                startingRound['12M'].bottom = seedWithTeams['4Seed'];

                startingRound['13M'].top = seedWithTeams['3Seed'];
                startingRound['13M'].bottom = seedWithTeams['14Seed'];

                startingRound['14M'].top = seedWithTeams['6Seed'];
                startingRound['14M'].bottom = seedWithTeams['11Seed'];

                startingRound['15M'].top = seedWithTeams['7Seed'];
                startingRound['15M'].bottom = seedWithTeams['10Seed'];

                startingRound['16M'].top = seedWithTeams['15Seed'];
                startingRound['16M'].bottom = seedWithTeams['2Seed'];

                bracket.rounds.round4 = rounds['4Round'];
                bracket.rounds.round5 = rounds['5Round'];
            }

            bracket.teams = seedWithTeams;

            DataService.addBracket(bracket)
                .then(function (response) {
                    $location.path("/bracket/" + bracket.id);
                })
                .catch(function (err) {
                    console.log('error: ' + err);
                    $scope.showError({
                        message: 'Error with adding bracket to backend'
                    });
                })
        }

        $scope.knuthShuffle = function (array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
    });
