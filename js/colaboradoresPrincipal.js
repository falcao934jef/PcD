window.addEventListener("load", function(){

	//Acessa o banco de dados Firebase
	var dados = new Firebase("https://blistering-heat-9478.firebaseio.com");

	function selecionarColaborador(){
		dados.child('users').on("value", function(dadosBanco) {
		 
			var person = dadosBanco.val();

			var listaDeColaboradores = [];
			
		  	 // Recupera o projeto no HTML
		  	for (var i in person){

		  		if(listaDeColaboradores.indexOf(person[i].name) < 0){

		  			var recebeDadosColaborador = $('<input type="checkbox" name="nomeColaborador" value="'+i+'" data-nome="'+person[i].name+'"/>');  		
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
						$('#idNomeDoColaborador').append(recebeProjetos).append('<label>'+personUsers[index].name+'</label><br>');
					}
				}
			}else{

				selecionarColaborador();
			}
		});
	});
}
	function limpaListaDeColaboradores(){
		$('#idNomeDoColaborador').html('');
	}
	
	filtrarColaboradoresPorProjeto();

	function excluirColaboradores (){
		$( "#caixaDialogo" ).dialog({
		      autoOpen: false,
		      resizable: false,
		      modal: true,
			    buttons: {
				    "Confirmar": function() {
		          	colaboradoresSelecionados.each(function(){
		          	console.log(this.value);
		          	});
				    $( this ).dialog( "close" );
				    },
				    "Cancelar": function() {
				    $( this ).dialog( "close" );
		        	}
	      		}
	    });

		dados.child('users').on("value", function(dadosBanco) {
			var colaborador = dadosBanco.val();
			var colaboradoresSelecionados = $('input[name=nomeColaborador]:checked');
			console.log(colaboradoresSelecionados);
				
			$( "#limpar" ).click(function() {
	     		 $( "#caixaDialogo" ).dialog( "open" );
	   		});	
		});
	}
	excluirColaboradores();
	
}); // Fim do addEventListener