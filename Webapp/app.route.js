(function(){
	
	'use strict';

	angular
		.module('app')
		.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', routeConfig]);

	function routeConfig($stateProvider, $locationProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '^/', 
				templateUrl: '/app/home/home.html',
				controller: 'HomeController as home'
			})
			.state('graph', {
			    url: '^/graph',
			    views: {
			        '': {
			            templateUrl: '/app/graph/graph.html'
			        },
			        'centrality@graph': {
			            templateUrl: '/app/graph/graph-centrality.html',
                        controller: 'GraphCentralityController as graph'
			        },
			        'static@graph': {
			            templateUrl: '/app/graph/graph-static.html',
			            controller: 'GraphStaticController as graphstatic'
			        },
			        'download@graph': {
			            templateUrl: '/app/graph/graph-download.html',
			            controller: 'GrapDownloadController as graphdownload'
			        },
			    },
				
			})
            .state('core', {
                url: '^/core',
                templateUrl: '/app/core/core.html',
                controller: 'CoreController as core'
            })
			.state('stats', {
				url: '^/stats', 
				templateUrl: '/app/stats/stats.html',
				controller: 'StatsController as stats'
			})
            .state('importance', {
                url: '^/importance',
                templateUrl: 'app/importance/importance.html',
                controller: 'ImportanceController as importance'
            })
            .state('pagecount', {
                url: '^/pagecount',
                templateUrl: 'app/page_count/page_count.html',
                controller: 'PageCountController as pageCount'
            })
            .state('about', {
            url: '^about',
            templateUrl: 'app/about/about.html',
            controller: 'AboutController as about'
            })
            .state('cliques', {
                url: '^cliques',
                templateUrl: 'app/cliques/cliques.html',
                controller: 'CliquesController as cliques'
            }
            )
	    ;
		$locationProvider.html5Mode(true);
	}

})();