$(document).ready(function(){
	$('.nav-item a[href="#menu_search"]').tab('show');
	$("#search2").focus();
});

$('#modal_profile').on('hidden.bs.modal', function () {
  angular.element(document.getElementById('appController')).scope().unselect_profile();
})

$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
    angular.element(document.getElementById('appController')).scope().next_page_result();
   }
});

function reajust_screen(){
	if($(window).width()< 758){
		if(!document.getElementById('bt_collapse').classList.contains("collapsed")){
			$("#bt_collapse").addClass("collapsed");
			$("#bt_collapse").attr("aria-expanded","false");
			$("#bt_collapse").click();
			//alert('ja ta fechado')
		}
			
		
	}
	else{
		if(document.getElementById('bt_collapse').classList.contains("collapsed")){
			$("#bt_collapse").click();
		}		
	}
}

window.addEventListener('resize', function () {
	reajust_screen();
});

reajust_screen();