angular.module('twitter').controller('callbackCtrl', ['$scope', 'twitterSvc', '$state', '$location', 'modalErrorSvc', 'sessionSvc', function($scope, twitterSvc, $state, $location, modalErrorSvc, sessionSvc){
	//pagina a la cual aterrizan los usuarios despues de loguearse con facebook.
	//los logeo y redirijo automaticamente
	
	var body = {
		oauthToken: $location.search().oauth_token,
		oauthVerifier: $location.search().oauth_verifier,
		requestToken: sessionSvc.getTwitterRequestTokens().requestToken,
		requestTokenSecret: sessionSvc.getTwitterRequestTokens().requestTokenSecret
	};

	twitterSvc.login(body).then(function(resp) {
		$state.go('main.home', {}, { reload: true });
	}, function(error){
		modalErrorSvc({
			textContent: error
		});
	});
}]);