(function(){

	'use strict';
	
	angular
		.module('app')
		.factory('storage', storage);

	function storage() {

	    return {
	        info: '',
            stats: ''
	    }

	    //var setInfo = function (info) {
	    //    var nodes = info.nodes;
	    //    var links = info.links;
	    //    $cookies.putObject('info.nodes', nodes);
	    //    $cookies.putObject('info.links', links);
		//}

		//var getInfo = function(){
		//    var info = {
		//        nodes: $cookies.getObject('info.nodes'),
		//        links: $cookies.getObject('info.links')
		//    };
		//    return info;
		//}

		//var setStats = function(stats){
		//	$cookies.putObject('stats', stats);
		//}

		//var getStats = function(){
		//	return $cookies.getObject('stats');
		//}

		//return {

		//	getInfo : getInfo,
		//	setInfo : setInfo,
		//	getStats : getStats,
		//	setStats : setStats

		//}

	}

})();