(function () {

    'use strict';

    angular
        .module('app')
        .controller('CliquesController', ['$rootScope', '$state', '$http', 'storage', cliques]);

    function stat($rootScope, $state, $http, storage) {
        var cliques = this;
        cliques.cliques = JSON.parse(sessionStorage.stats).Clique_stats;
    }

})();