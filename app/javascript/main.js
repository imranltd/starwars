(function(){

	angular
		.module('starwarsApp', ['restangular', 'ui.router'])
		.config(function(RestangularProvider) {
			RestangularProvider.setBaseUrl('http://swapi.co/');})
		.config(
			function($stateProvider, $urlRouterProvider) {
				$urlRouterProvider.otherwise("/");

				$stateProvider
					.state('index', {
            			url: "/",
            			templateUrl: "templates/starwars-search.html",
            			controller: 'starwarsController',
            			controllerAs: 'vm'
        			})
					.state('index.details', {
						templateUrl: 'templates/person.html'
					});
					
			})
		.factory('_', ['$window',
			function($window) {

				return $window._;
			}
		])
		.controller('starwarsController', ['$scope', 'Restangular', '_', '$state',
			function($scope, Restangular, _, $state){
				
				$state.transitionTo('index.details');

				var vm = this;
				vm.loading = 'true';
				
				activate = function(){
					vm.shareMe = shareMe;
					vm.getNextPage = getNextPage;
					vm.getPreviousPage = getPreviousPage;

					vm.LoadPreviousPage = LoadPreviousPage;
					vm.LoadNextPage = LoadNextPage;

					vm.getPersonDetails = getPersonDetails;
					
					loadPage();
				};

				var LoadNextPage = function(){
					loadPage(vm.nextPage);
				};

				var LoadPreviousPage = function(){
					//$scope..loading = true;
					console.log('previousPage ' + vm.previousPage);
					loadPage(vm.previousPage);
				};

				var loadPage = function(pageNum){
					var firstTenResults;

					vm.loading = true;
					
					Restangular.one("api").customGET("people", {page: pageNum})
						.then(function(data){
							vm.nPage = getNextPage(data.next);
							vm.previousPage = getPreviousPage(data.previous);
							firstTenResults = data.plain().results;
						})
						.then(function(){
							Restangular.one("api").customGET("people", {page: vm.nPage})
							.then(function(data2){
								vm.nextPage = getNextPage(data2.next);
								vm.people = _.concat(firstTenResults, data2.plain().results);

								_.forEach(vm.people, function(objv, objk){
									_.forEach(objv, function(v,k) {
										if(k==='url') {
											var a = (v) ? v.split("/") : null;
											objv.personId = a[5];
										}
									});
								});
							})
							.finally(stopLoading);
						});
						
				};


				var getNextPage = function (nextPageLink){
					var nextPageUrl = nextPageLink,
						nextPageObj = (nextPageUrl) ? nextPageUrl.split("?") : null,
						nextPageNum = (nextPageObj) ? nextPageObj[1].split("=") : null;

						return (nextPageNum) ? nextPageNum[1] : null;
				};

				var getPreviousPage = function (previousPageLink){
					var previousPageUrl = previousPageLink,
						previousPageObj = (previousPageUrl) ? previousPageUrl.split("?") : null,
						previousPageNum = (previousPageObj) ? previousPageObj[1].split("=") : null;

						return (previousPageNum) ? previousPageNum[1]-1 : null;
				};
				var getPersonDetails = function(personId){
					vm.loadingDetails = true;

					$state.params.personId = personId;

					Restangular.one("api", "people").customGET(personId+'/', {format:'json'})
					.then(function(response){
						
						$state.params.personName = response.name;

						var removedItems = ['name',
											'homeworld',
											'films',
											'species',
											'vehicles',
											'starships',
											'created',
											'edited',
											'url'];

						vm.personDetail = _.omit(angular.fromJson(response.plain()), removedItems);
					})
					.finally(function(){
						vm.loadingDetails = false;
					});


				};

				var stopLoading = function(){
					vm.loading = false;
				};
				var shareMe = function(person){
					var payload = {
									'userId'		: 10, 
									'userName' 		: 'Imran',
									'sharedItem'	: {
														'personId'		:	$state.params.personId,
														'personName'	:	$state.params.personName
													}
								};

					alert('See console log for payload');
					console.log(payload);
				};



				activate();	 
			}
			
		])
		.filter('capitalize', function() {
			return function(input, scope) {
				if (input!==null) {
					input = input.toLowerCase();
					return input.substring(0,1).toUpperCase()+input.substring(1);
				}
			};
		})
		.controller('personController', ['$scope', 'Restangular', '_', '$routeParams',
			function($scope, Restangular, _, $routeParams){
				console.log('person');
				console.dir($routeParams);
			}
		])
		.directive('starwarsSearch', function() {
			return {
				restrict: 'E',
				templateUrl: 'templates/starwars-search.html'
			};
		});
		
}());