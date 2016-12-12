angular.module('socialFeed').directive('socialFeed', ['$interval', function($interval) {
	return {
		restrict: 'E',
		scope: {
			socialMedia: '=',
			refreshTime: '=?'
		},
		templateUrl: 'templates/socialFeedDcv.html',
		link: function(scope, element, attrs) {
			scope.refreshTime = scope.refreshTime || 3000;
			// configuro el schema para cada tipo de contenido
			scope.schema = {
				facebook: {
					icon: 'fa-facebook',
					description: 'description',
					btn1Class: 'fa-thumbs-o-up',
					btn2Class: 'fa-share',
					btn1Value: 'up',
					btn2Value: 'share'
				},
				twitter: {
					icon: 'fa-twitter',
					description: 'description',
					btn1Class: 'fa-star-o',
					btn2Class: 'fa-retweet',
					btn1Value: 'star',
					btn2Value: 'retweet'
				}
			};

			scope.currentIndex = 0;
			$interval(function changeSocialMediaIndex(){
				if (scope.socialMedia) {
					scope.currentIndex++;
					if (scope.currentIndex > scope.socialMedia.length - 1) {
						scope.currentIndex = 0;
					}
				}
			}, scope.refreshTime);

		}
	};
}]);