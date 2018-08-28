(function(){

	'use strict';

	angular
		.module('app')
		.run(['$rootScope', '$stateParams', '$state', run]);

	function run($rootScope, $stateParams, $state){
		$rootScope.$on('$stateChangeStart', function(){
			$rootScope.projectName = 'Novel Networks';
			$rootScope.api = 'http://localhost:5000/';
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		});
	}

})();