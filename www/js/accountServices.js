angular.module('starter.accountServices', [])

.factory('AccountAPI', function($rootScope, $http, $window, $ionicLoading){
	var base = 'http://localhost:5000';




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
		},
		signout: function(token){
			return $http.get(base+'/authentication/signout', {
				method: 'GET',
				params: {
					token: token
				}
			});
		}
	}


});
