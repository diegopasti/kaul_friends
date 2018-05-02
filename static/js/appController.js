var app = angular.module('app', []);
app.controller('appController', ['$scope', function($scope) {
	$scope.github_token = "754153a677e7b48da8b0390627d359faa34c5dfc";
	$scope.friends_list = [];
	$scope.result_list = [];
	$scope.cached_list = {};
	
	$scope.cached_result_numbers = {};
	$scope.result_numbers = 0;
	
	$scope.profiles = {};
	$scope.selected_profile = null;
	
	$scope.current_page = 1;
	$scope.start_search = false;
	$scope.last_query = "";
	
	$scope.can_add_friend = true;
	
	$scope.init_search = function(){
		var init_word = $("#search2").val();
		$scope.start_search = true;
		setTimeout(function(){
			$("#search").val(init_word);
			$("#search").focus();				
		},10)		
	}
	
	$scope.search_users = function(){		
		var search = $("#search").val();
		if(search.length>4){
			if ($scope.cached_list[search]){
				$scope.result_list = $scope.cached_list[search]; // JSON.parse(data).items;//$scope.cached_list['diegopas'];
				$scope.result_numbers = $scope.cached_result_numbers[search];
				$scope.last_query = search;
			}			
			else{
				$.ajax({
					type: 'GET',
					url: "https://api.github.com/search/users?q="+search+"&page="+$scope.current_page.toString()+"&per_page=40", 
					headers: { 
						Accept: "application/vnd.github.v3.text-match+json",
					},

					success: function (data) {
						$scope.cached_list[search] = data.items;
						$scope.result_list = $scope.cached_list[search];
						
						$scope.cached_result_numbers[search] = data.total_count; 
						$scope.result_numbers = data.total_count;
						
						$scope.last_query = search;
						$scope.$apply();
					},

					failure: function (data) {
						$scope.start_search = true;
						$scope.result_list = [];
						alert("Erro! Operação não pode ser realizada.");
					},
				});		
			}			
		}
		else{
			if(search.length==0){
				$scope.start_search = false;
				setTimeout(function(){
					$("#search").val("");
					$("#search2").focus();				
				},10)		
			}
			$scope.result_list = [];
		}
	}
	
	$scope.next_page_result = function(){
		if($scope.result_numbers > $scope.result_list.length){
			$scope.current_page = $scope.current_page + 1; 
			$.ajax({
				type: 'GET',
				url: "https://api.github.com/search/users?q="+$scope.last_query+"&page="+$scope.current_page.toString()+"&per_page=40",
				headers: {Accept: "application/vnd.github.v3.text-match+json"},

				success: function (data) {
					$scope.cached_list[$scope.last_query] = $scope.cached_list[$scope.last_query].concat(data.items);
					$scope.result_list = $scope.cached_list[$scope.last_query];// JSON.parse(data).items;//$scope.cached_list['diegopas'];
					$scope.$apply();
				},

				failure: function (data) {
					alert("Erro! Operação não pode ser realizada.");
				},
			});
		}
	}
	
	$scope.get_details = function(username){
		$scope.can_add_friend = true;
		$.ajax({
			type: 'GET',
			url: "https://api.github.com/users/"+username, //"/events/public?per_page=5",
			data:{username:$scope.github_token},
			headers: {Accept: "application/vnd.github.v3.text-match+json"},
			
			success: function (data) {
				$scope.profiles[username] = {};
				$scope.profiles[username].id = data.id				 
				$scope.profiles[username].login = data.login;
				$scope.profiles[username].name = data.name;
				$scope.profiles[username].email = data.email;
				$scope.profiles[username].avatar = data.avatar_url;
				$scope.profiles[username].user_page = data.html_url;
				$scope.profiles[username].followers = data.followers;
				$scope.profiles[username].following = data.following;
				$scope.profiles[username].location = data.location;
				$scope.profiles[username].created_at = data.created_at;
				$scope.profiles[username].updated_at = data.updated_at;
				$scope.profiles[username].bio = data.bio;
				$scope.selected_profile = $scope.profiles[username];
				
				if(!$scope.profiles[username].email){
					$.ajax({
						type: 'GET',
						url: "https://api.github.com/users/"+username+"/events/public?per_page=5",
						data:{username:$scope.github_token},
						headers: {Accept: "application/vnd.github.v3.text-match+json"},
						
						success: function (data) {
							try{
								$scope.profiles[username].email = data[0].payload.commits[0].author.email;
								$scope.profiles[username].events = data;
								$scope.$apply();
							}
							catch(err) {
							}
							
						},
						failure: function (data) {
							alert("Erro! Email não encontrado.");
						},
					});						
				}
				
				$scope.$apply();
			},

			failure: function (data) {
				alert("Erro! Operação não pode ser realizada.");
			},
		});			
	}
	
	$scope.unselect_profile = function(){
		$scope.selected_profile = null;
	}
	
	$scope.add_friend = function(){
		if($scope.selected_profile){
			$scope.friends_list.push($scope.selected_profile);
		}		
	}
	
	$scope.view_friend = function(friend){
		$scope.can_add_friend = false;
		$scope.selected_profile = friend;
	}
}]);

