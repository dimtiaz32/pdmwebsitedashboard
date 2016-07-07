angular.module('starter.userServices', [])

.factory('UserAPI', function($rootScope, $http, $ionicLoading, $window){
	var base = "https://dreamrun.herokuapp.com";

	return {
		//actual account related activities should be handled by auth
			
			//functions to find other users
		findOne: function(id){
			return $http.get(base+'/findUser/'+id, {
				method: 'GET',
				params: {
					token: token
				}
			});
		},
		findByEmail: function(email){
			return $http.get(base+'/users/search' + email, {
				method: 'GET',
				params: {
					token: token 
				}
			});
		},
		findByName: function(fName, lName){
			return $http.get(base+'/users/search/:name', +name{
				method:'GET',
				params: {
					token: token
				}
			});
		},
		findCharity: function(id, charity){
			return $http.get(base+'/users/:id/charity', {
				method: 'GET',
				params: {
					token: token
				}
			});
		},
		selectCharity: function(id, charityId){
			return $http.put(base+'/user')
		}

	}
})