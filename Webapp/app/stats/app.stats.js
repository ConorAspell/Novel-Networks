(function () {

    'use strict';

    angular
        .module('app')
        .controller('StatsController', ['$rootScope', '$state', '$http', 'storage', stat]);

    function stat($rootScope, $state, $http, storage) {
        var stats = this;
        stats.test = "TEST";
        stats.importance = JSON.parse(sessionStorage.info).importance;
        stats.pagerank = JSON.parse(sessionStorage.info).pagerank;
        stats.graph_stats = JSON.parse(sessionStorage.stats).graph_stats;
        stats.peripheral = JSON.parse(sessionStorage.stats).Periphery_stats;
        stats.central = JSON.parse(sessionStorage.stats).Central_stats;
        stats.cliques = JSON.parse(sessionStorage.stats).Clique_stats;
    }

})();