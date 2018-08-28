(function () {

    'use strict';

    angular
        .module('app')
        .controller('PageCountController', ['$rootScope', '$state', '$http', 'storage', pagecounts]);

    function pagecounts($rootScope, $state, $http, storage) {
        pagecount = this;
        pagecount.pagerank = JSON.parse(sessionStorage.info).pagerank;       
    }

})();