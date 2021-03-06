angular.module('xingwall', [])

  .service('Profile', function ($q) {
    this.all = function (opts) {
      var deferred = $q.defer();
      socket.emit('profiles:all', opts);

      socket.on('profiles:all', function (profiles) {
        deferred.resolve(profiles);
      });

      return deferred.promise;
    }
  })

  .directive('xingwall', function () {
    return {
      link: function (scope, el, attr) {
        scope.wallId = attr.xingwall;
        scope.loadData();
      },
      controller: function ($scope, $window, Profile) {
        $scope.loadData = function () {
          Profile.all({wallId: $scope.wallId}).then(function (profiles) {
            $scope.profiles = profiles;
          });
        };

        $scope.setCurrentProfile = function(profile) {
          if($scope.currentProfile) {
            $scope.currentProfile.isActive = false;
          }

          $scope.currentProfile = profile;
          $scope.currentProfile.isActive = true;
        };

        $scope.openPopup = function () {
          window.open('/connect/' + $scope.wallId, 'Connect to XING', 'width=600, height=400')
        };

        socket.on('profiles:updated', function () {
          $scope.loadData();
        });
      }
    }
  })
;
