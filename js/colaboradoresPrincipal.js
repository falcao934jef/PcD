window.addEventListener("load", function(){

	//Acessa o banco de dados Firebase
	var dados = new Firebase("https://blistering-heat-9478.firebaseio.com");

	function selecionarColaborador(){
		dados.child('users').on("value", function(dadosBanco) {
		 
			var person = dadosBanco.val();

			var listaDeColaboradores = [];
			
			limpaListaDeColaboradores();

		  	 // Recupera o projeto no HTML
		  	for (var i in person){

		  		if(listaDeColaboradores.indexOf(person[i].name) < 0){

		  			var recebeDadosColaborador = $('<input type="checkbox" name="nomeColaborador" value="'+i+'" data-nome="'+person[i].name+'"/>');  		
		  			recebeDadosColaborador.on('change', onChangeCheckbox);
		  			$("#idNomeDoColaborador").append(recebeDadosColaborador).append('<label>'+person[i].name+'</label><br>');
		 		}
			}
		});
	}
	/*
	Inserir funcionarios
	dados.child('users').push({'name': 'Cristiano  de Oliveira Santos', 'project': '', 'workTime': {}})

	Inserir projects

	dados.child('projects').push({'name': 'Positivo'})

	*/
	selecionarColaborador();

	function selecionarProjeto(){
		dados.child('projects').on("value", function(dadosBanco) {
		 
			var projetos = dadosBanco.val();

			var listaDeProjetos = [];
			
		  	 // Recupera o projeto no HTML
		  	for (var i in projetos){

		  		if(listaDeProjetos.indexOf(projetos[i].name) < 0	){
		  			$("#idProjeto").append("<option value='"+i+"'>" +projetos[i].name+"</option>");
		  			listaDeProjetos.push(projetos[i].name);
		 		}
			}
		}); 
	}
	selecionarProjeto();	

	function filtrarColaboradoresPorProjeto(){

		$("#idProjeto").on('change', function(){

		var value = this.value;

		dados.child('users').on("value", function(dadosBanco) {

			var personUsers = dadosBanco.val();

			limpaListaDeColaboradores(); 

			if(value != ''){		
				for (var index in personUsers){
					if(personUsers[index].project == value) {
						var recebeProjetos = $('<input type="checkbox" name="nomeColaborador" value="'+index+'" data-nome="'+personUsers[index].name+'"/>');
						recebeProjetos.on('change', onChangeCheckbox);
						$('#idNomeDoColaborador').append(recebeProjetos).append('<label>'+personUsers[index].name+'</label><br>');
					}
				}
				if($('input[name=nomeColaborador]').length ==0){
					$('#idNomeDoColaborador').html('<span id ="projetoVazio"> Não existe colaboradores no projeto selecionado.</span>');
				}

			}else{

				selecionarColaborador();
			}
		});
	});
}
	function limpaListaDeColaboradores(){
		$('#idNomeDoColaborador').html('');
		$("#limpar").prop("disabled", true);
	}
	
	filtrarColaboradoresPorProjeto();
   	 						
	$( "#caixaDialogo" ).dialog({
	      autoOpen: false,
	      resizable: false,
	      modal: true,
		    buttons: {
			    
			    "Confirmar": function() {
			    	var colaboradoresSelecionados = $('input[name=nomeColaborador]:checked');
			 
	            	colaboradoresSelecionados.each(function(){
	            		dados.child('users').child(this.value).remove();
	            		selecionarColaborador();
	            	});
	            	$( this ).dialog( "close" );
	          
			    },
			    
			    "Cancelar": function() {
			    	$( this ).dialog( "close" );
	        	}
      		}
    });

	
	function onChangeCheckbox(){
		var colaboradoresSelecionados = $('input[name=nomeColaborador]:checked');

		if(colaboradoresSelecionados.length > 0){
			$("#limpar").prop("disabled", false);	
		}else{
			$("#limpar").prop("disabled", true);
		}
	}

	$( "#limpar" ).click(function() {
			if($("#limpar").prop("disabled") == false){
				$( "#caixaDialogo" ).dialog( "open" );
			}
		return false;
	});

	$('#salvarProjeto').click(function(){
		if($('#inputProjeto').val() != ''){	
			dados.child('projects').push({'name': $('#inputProjeto').val() });
		}else{
			$(".mensagemAlerta").show();
		}
	});

	$('#salvarColaborador').click(function(){
		
		if($('#inputColaborador').val() != ''){
			dados.child('users').push({'name': '', 'project': '', 'workTime': {}})
		}else{
			alert("Por favor digite o nome do novo colaborador!")
		}
	});

	$( "#btnNovoColaborador" ).click(function() {
			if($("#btnNovoColaborador").prop("disabled") == false){
				$( ".novoColaborador" ).dialog( "open" );
			}
		return false;
	});
}); // Fim do addEventListener