drip8
	.directive( "profile" , [
		"$http",
		"Video",
		"$rootScope",
		function directive ( $http , Video , $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.profile = { };					

					scope.getUserInfo = function getUserInfo ( ) {
						$http.get( "/api/user" )
						.success( function ( response ) {
							scope.profile = response.data;
							scope.trustUrl( );
						} );
					};

					scope.trustUrl = function trustUrl ( ) {
						var video_id = "";
						$http.post( "/api/video_featured" , {
							"user_id": scope.profile.id
						} )
						.success( function ( response ) {
							if ( response.link ) {
								video_id = response.link.split( 'v=' )[1];
								var ampersandPosition = video_id.indexOf( '&' );
								if ( ampersandPosition != -1 ) {
								  video_id = video_id.substring( 0 , ampersandPosition );
								}
							}

							scope.profile.featured = response.link;
							$rootScope.$broadcast( "profile-data" , scope.profile );
							scope.profile.featuredVideo = Video.videoSource( video_id );							
						} );
					};

					scope.getUserInfo( );					
				}
			}
		}
	] );