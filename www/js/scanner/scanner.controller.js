(function() {
  angular.module('starter.controllers')
  .controller('ScanCtrl', function ($scope, $cordovaBarcodeScanner, httpService, $ionicModal, $state) {
    $scope.scan = function () {
      $ionicModal.fromTemplateUrl('js/scanner/result_modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      $cordovaBarcodeScanner.scan()
      .then(function (result) {
        httpService.getMovieTitle(result.text)
        .then(function (data) {
          $scope.data = data.data;
          $scope.openModal();
        })
        .catch(function (error) {
          console.log(error.data);
          alert('Scanning failed: ' + error.data.message);
        });
      });
    };

    $scope.addCollection = function() {
      var data = $scope.data;
      httpService.addMovie(data)
      .then(function() {
        $scope.message = {status: 'success', data: 'Movie added successfully.'};
        $scope.closeModal();
      }).catch(function(err) {
        $scope.message = {status: 'danger', data: err };
      });
    };
  });
})();
