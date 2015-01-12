window.onload = function(){



	$('.dialog').dialog({
		autoOpen: false,
		modal: true
	});


	$('#btnNovoColaborador').on('click', function(){
		$('.novoColaborador').dialog('open');
	});
 


	$('#btnNovoProjeto').on('click', function(){
		$('.NovoProjeto').dialog('open');
	});


}