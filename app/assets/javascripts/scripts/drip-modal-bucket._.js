drip8
	.directive( "dripModalBucket" , [
		"$http",
		"$rootScope",
		'Video',
		'profileService',
		function directive ( $http , $rootScope , Video , profileService ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , atrributeSet ) {
					//console.log( "drip-modal-bucket" );
					$rootScope.$on( 'see-bucket' , function( evt , data ){
						//console.log( data )
						scope.directDrip = Video.videoSource( data.drip.link.split( "v=" )[1] );
						scope.dripBucketDetails = data;
						scope.comments = scope.dripBucketDetails.drip.comments;
						for( var index = 0 ; index <= data.drip.dripbucket.drips.length-1 ; index++ ){
							var video_id = scope.dripBucketDetails.drip.dripbucket.drips[ index ].link.split( "v=" )[1];
							//console.log( video_id );
							scope.dripBucketDetails.drip.dripbucket.drips[ index ].thumb = Video.thumbnail( video_id );
							//console.log( scope.dripBucketDetails.drip.dripbucket.drips[ index ].thumb );
							//console.log( scope.dripBucketDetails.drip.dripbucket.drips[ index ].link );

						}
						//console.log( scope.dripBucketDetails );
						scope.drip = scope.dripBucketDetails.drip;
					} );

					scope.exit = function exit(){
						$("#myModal").modal("hide");
					};

					scope.fbShare = function fbShare( link ){
						FB.ui({
						  method: 'share',
						  href: link,
						  caption: "www.drip8.com",
						}, function(response){});
						//console.log( link );
					};
					
					scope.changeVideo = function changeVideo( data ){
						scope.$broadcast( 'change-video' , data )
					};

					scope.$on( 'change-video' , function( evt , data ){
						scope.directDrip = Video.videoSource( data.link.split( "v=" )[1] );
						scope.comments = data.comments;
						scope.drip = data;
						//console.log( data );
					} );

					scope.passProfile = function passProfile( profile ){
						localStorage.setItem("userProfile", JSON.stringify( profile ) );
					};
					
					scope.react = function react( comment ){
						var user = profileService.setProfile();
						var fbId = user.profile_picture.split( "/" )[3];
						//console.log( scope.dripBucketDetails );
						//console.log( user.profile_picture.split( "/" ) )
						
						$http.post( "/api/create_comment" , {
								"comment":{
									"user_id"		: user.id ,
									"drip_id"		: scope.drip.id ,
									"dripbucket_id"	: "" ,
									"facebook_id"	: fbId ,
									"body"			: comment
								}
								} )
								.success( function ( response ) {
									var comment = response.comment;
									comment.user = user;
									scope.comments.push( comment );
								} );
						scope.dripComment = "";
					}

				}
			}
		}
	] );