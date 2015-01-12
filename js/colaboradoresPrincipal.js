window.addEventListener("load", function(){

	//Acessa o banco de dados Firebase
	var dados = new Firebase("https://blistering-heat-9478.firebaseio.com");

	function selecionarColaborador(){
		dados.on("value", function(dadosBanco) {
		 
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

	selecionarColaborador();

	
	function removerColaborador(){


	}

});

