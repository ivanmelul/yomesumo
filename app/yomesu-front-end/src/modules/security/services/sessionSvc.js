angular.module('security').factory('sessionSvc' ,[function  ()	{
	var api = {};
	var _token;

	api.setToken = function(value){
		_token = value;
		localStorage._ymsToken = _token;
	};

	api.getToken = function(){
		return _token || localStorage._ymsToken;
	};

	api.clear = function(){
		_token = undefined;
		delete localStorage._ymsToken;
	};

	api.setTwitterRequestTokens = function(requestToken, requestTokenSecret){
		localStorage._ymsTwitterRequestToken = requestToken;
		localStorage._ymsTwitterRequestTokenSecret = requestTokenSecret;
	};

	api.getTwitterRequestTokens = function(){
		return {
			requestToken: localStorage._ymsTwitterRequestToken,
			requestTokenSecret: localStorage._ymsTwitterRequestTokenSecret
		};
	};
	
	return api;
}]);
