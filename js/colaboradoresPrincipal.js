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

		  			var recebeDadosColaborador = $('<input type="checkbox" name="Nome do Colaborador" value="" id="'+i+'" data-nome="'+person[i].name+'"/>');  		
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
		  			$("#idProjeto").append("<option value='"+projetos[i].name+"'>" +projetos[i].name+"</option>");
		  			listaDeProjetos.push(projetos[i].name);
		 		}
			}
		}); 
	}
	selecionarProjeto();

	function filtrarPorProjeto(){
		
		dados.child('projects').on("value", function(dadosBanco) {
		
		var projetos = dadosBanco.val();

			$('#idProjeto').on('change', function(){
			var select = $(this);
			
				for (var i in projetos){
					if(select){
				}

			});	
		});

	filtrarPorProjeto();
	
	}

});

