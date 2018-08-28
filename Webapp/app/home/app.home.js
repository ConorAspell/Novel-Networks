(function () {

    'use strict';

    angular
        .module('app')
        .controller('HomeController', ['$rootScope', '$state', '$http', 'storage', home]);

    function home($rootScope, $state, $http, storage) {

        var home = this;
        home.file = null;
        home.thing = 'Paragraphs';
        home.Integer = 5

        home.uploadTxtFile = function (files) {
            if (home.file == null) {
                home.file = new FormData();
            }
            home.file.append("file", files[0]);
        }

        home.uploadCharFile = function (files) {
            if (home.file == null) {
                home.file = new FormData();
            }
            home.file.append("character", files[0]);
        }

        home.title = $rootScope.projectName;

        home.upload = function () {
            if (home.file == null) {
                alert("Upload 2 files");
                return;
            }
            $http({ method: 'POST', url: $rootScope.api + 'uploader?type='+home.thing+ '&N='+home.Integer, data: home.file, headers: { 'Content-Type': undefined } })
                .then(function (response) {
                    var json = JSON.parse(response.data);
                    console.log(json.info);
                    sessionStorage.info = JSON.stringify(json.info);
                    sessionStorage.stats = JSON.stringify(json.stats)
                    //storage.setinfo(json.info);
                    //storage.setstats(json.stats);
                    $state.go('graph');
                }, function (response) {
                    console.log("Fail");
                });
        }

    }

})();