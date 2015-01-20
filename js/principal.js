window.onload = function(){

	$('.dialog').dialog({
		autoOpen: false,
		close: function( event, ui ) {
			$(".mensagemAlerta").hide();
		},
		modal: true
	});

	$('#btnNovoColaborador').on('click', function(){
		$('.novoColaborador').dialog('open');
	});
 
	$('#btnNovoProjeto').on('click', function(){
		$('.NovoProjeto').dialog('open');
	});

	$('#btnMudarProjeto').on('click', function(){
		$('.MudarProjeto').dialog('open');
	});

}