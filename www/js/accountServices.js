angular.module('starter.accountServices', [])

.factory('AccountAPI', function($rootScope, $http, $window, $ionicLoading){
	var base = 'https://dreamrun.herokuapp.com';




	return {
		getOne: function(id){
			return $http.get(base+'/account/:id', {
				method: 'GET',
				// params: {
				// 	token: token
				// }
			});
		},
		saveAccount: function(form, id){
			return $http.post(base+'/account/'+id, form, {
				method: 'POST',
				// params: {
				// 	token : token
				// }
			});
		}

	}


});
