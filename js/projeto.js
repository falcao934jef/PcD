
/*Título: Projeto Banco de Horas
* Descrição: Este projeto destina-se para fazer o acompanhamento das horas dos colaboradores do
* Instituto de Pesquisas Eldorado, onde são armazenadas todas as horas com os seus devidos cálculos
* atualizado, onde os seus respectivos Líder de Projetos consegue fazer todo o acompanhamento.
* Desenvolvedores: Thales, Rafael, Bruno, Marcos, Lucas, Jefferson
* Data: 08/12/2014
*/

//Carrega os dados do html no Firebase
window.addEventListener("load", function(){

	//Acessa o banco de dados Firebase
	var dados = new Firebase("https://blistering-heat-9478.firebaseio.com");

	function selecionarProjeto(){
		dados.on("value", function(dadosBanco) {
		 
			var person = dadosBanco.val();

			var listaDeProjeto = [];
			
		  	 // Recupera o projeto no HTML
		  	for (var i in person){

		  		if(listaDeProjeto.indexOf(person[i].project) < 0){
		  			$("#idProjeto").append("<option value='"+i+"'>" +person[i].project+"</option>");
		  			listaDeProjeto.push(person[i].project);

		 		}
			}
		}); 
	}

	selecionarProjeto();

	function colaboradorPorProjeto(){
		dados.on("value", function(dadosBanco) {

		  var person = dadosBanco.val();
		  	console.log(person);
		  	for (var i in person){
			  	var colaboradorCheckbox = $('<input type="checkbox" name="Colaboradores" value="" id="'+i+'" data-nome="'+person[i].name+'"/>');
				$("#idColaboradores").append('<label>'+person[i].name+'</label><br>');
				colaboradorCheckbox.on('change', onColaboradorChecked);
			}

		}); // Fim dados.on("value", function(dadosBanco)
	} // Fim function popularSelect

	function onColaboradorChecked(){
		var chart = $('#containerGrafico').highcharts();
		var check = $(this);
		var id = this.id;
		var nomeColaborador = check.attr('data-nome');
		
		if(check.is(':checked')){
			colaboradoresSelecionadosId.push(id);
			colaboradoresSelecionadosNome.push(nomeColaborador);
		}else{
			colaboradoresSelecionadosId.pop(id);
			colaboradoresSelecionadosNome.pop(nomeColaborador);
		}
		
		if(colaboradoresSelecionadosNome.length > 0){
			chart.xAxis[0].update({categories:colaboradoresSelecionadosNome},true);
		}else{
			chart.xAxis[0].update({categories:arrayColaboradores},true);
		}

	}

	$("#idProjeto").on('change', function(){

	});
});