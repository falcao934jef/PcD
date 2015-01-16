window.onload = function(){

	var dados = new Firebase("https://blistering-heat-9478.firebaseio.com");
	var arrayColaboradores = [];
	var arrayMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
	var arrayAnos = [];
	var worktime;
	var dataMes=[];
	var uniqueMeses = [];
	var uniqueAno = [];
	var saldoMes = [];
	var colecao = {};
	var colaboradoresSelecionadosId = [];
	var colaboradoresSelecionadosNome = [];

	dados.child('users').on("value", function(data) {

	  //carregando do banco de dados (Firebase) todos os dados de cada colaborador	{objeto}
	  var person = data.val();

	  //Preenchendo os checkboxes e preenchendo o array de colaboradores para o gráfico.
	  for (var i in person){
	  	// var colaboradorCheckbox = $('<input type="checkbox" name="Colaboradores" value="" id="'+i+'" data-nome="'+person[i].name+'"/>');
	  	// $("#idColaboradores form").append(colaboradorCheckbox).append('<label>'+person[i].name+'</label><br>');
	  	adicionaColaboradorNaLista(i, person[i].name);
	  	// colaboradorCheckbox.on('change', onColaboradorChecked);

	  	arrayColaboradores.push(person[i].name);
	  	worktime = person[i].workTime;
	  	colecao[i] = {};

	  	//Gerando o grafico
	  	gerarGrafico(arrayColaboradores, 0);

	  	//Pegando o ano [2014] de cada colaborador
	  	for (var w in worktime){
	  		var dataAtual = new Date(worktime[w].date);

	  		arrayAnos.push(dataAtual.getUTCFullYear());

	  		dataMes.push(arrayMeses[dataAtual.getUTCMonth()]);

			$.each(arrayAnos, function(i, el){
			    if($.inArray(el, uniqueAno) === -1) uniqueAno.push(el);
			});//Fim each

			$.each(dataMes, function(i, el){
			    if($.inArray(el, uniqueMeses) === -1) uniqueMeses.push(el);
			});//Fim each
	  		colecao[i][dataAtual.getUTCMonth()] = worktime[w].balance;	  	
		}//Fim for w
		
	  }// Fim for i
	  //Criando links de acordo com a quantidade de ano rgistrado no Banco de Dados Firebase JSON
	  for(var a=0; a<uniqueAno.length; a++){
	  	if(a == uniqueAno.length-1){
	  		//Inserindo link para cada ano existente no banco
	  		$('#listAnos').append('<a href="#" data="'+uniqueAno[a]+'" class="active">'+uniqueAno[a]+'</a>');	
	  	}
	  	else{
	  		$('#listAnos').append('<a href="#" data="'+uniqueAno[a]+'">'+uniqueAno[a]+'</a>');
	  	}
	  }
	 
	});

	function carregarDadosDoAno(){
		setTimeout(function(){
			$("#listAnos a").on('click', function(){
				dataMes=[];
				limparSaldoNoGrafico();

		  		$("#listAnos a").removeClass('active');
		  		$(this).addClass('active');

		  		carregarMeses();
			});

			carregarMeses();
		},1500);
	}

	carregarDadosDoAno();

	function carregarMeses(){

		dataMes=[];
		limparSaldoNoGrafico();

		var colaboradorWork;

		dados.child('users').on("value", function(data) {
			var person = data.val();

			//Acessando o colaborador
			for (var i in person){

				colaboradorWork = person[i].workTime;

				//Acessando o workTime do colaborador
				for(var c in colaboradorWork){

					var dataAtual = new Date(colaboradorWork[c].date);

					if(dataAtual.getUTCFullYear() == $('.active').attr('data')){
						saldoMes.push(colaboradorWork[c].balance);
						
						dataMes.push(dataAtual.getUTCMonth());
					}
				}
			}

			
			uniqueMeses = [];
			$.each(dataMes, function(i, el){
			    if($.inArray(el, uniqueMeses) === -1) uniqueMeses.push(el);
			});//Fim each
			
		});

		adicionarSaldosNoGrafico();
	}

	function adicionarSaldosNoGrafico(){
		var chart = $('#containerGrafico').highcharts();

		var dadosMes = getDadosMes();

		for(var j=0; j<uniqueMeses.length; j++){	
			chart.addSeries({                        
			    name: arrayMeses[uniqueMeses[j]], //seleciona mes dinamico - iteração
			    data: dadosMes[uniqueMeses[j]], //pegar dados do mes dinamico
			});
	  	}

	}

	function getDadosMes(){
		var dataMeses = {};
		for(var id in colecao){

			if(colaboradoresSelecionadosId.length == 0 ){
				dataMeses = getDadosColaboradorPorId(id, dataMeses);
			}else if(existEmColabodoresSelecionados(id)){
				dataMeses = getDadosColaboradorPorId(id, dataMeses);
			}
		}

		return dataMeses;
	}

	function getDadosColaboradorPorId(id, dataMeses){

		for(var i = 0; i < uniqueMeses.length; i++){
			if(dataMeses[i] == null){
				dataMeses[i] = [];
			}
			var balanceMes = colecao[id][i];
			
			if(balanceMes != null){
		    	balanceMes = parseFloat(balanceMes.replace(':', '.'));	
		    }else{
		    	balanceMes = 0;
		    }

		    dataMeses[i].push(balanceMes);	
		}

		return dataMeses;
	}

	function existEmColabodoresSelecionados(idColecao){
		var exist = false;

		for(var i in colaboradoresSelecionadosId){
			if(colaboradoresSelecionadosId[i] == idColecao){
				exist = true;
				break;
			}
		}

		return exist;
	}

	function limparSaldoNoGrafico(){
		var chart = $('#containerGrafico').highcharts();
		while( chart.series.length > 0 ) {
		    chart.series[0].remove( false );
		}

		chart.redraw();		
	}
	
	function onColaboradorChecked(){
		var chart = $('#containerGrafico').highcharts();
		var check = $(this);
		var id = this.value;
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

		limparSaldoNoGrafico();
		adicionarSaldosNoGrafico();

	}

	function gerarGrafico(arrayColaboradores, saldoColaboradores){
		//Gráfico

		$('#containerGrafico').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: 'Horas trabalhadas'
				//text: 'Saldo de horas trabalhadas'
			},
			xAxis: {
				categories: arrayColaboradores //["Rafael", "Jeff", "Halef"]
			},
			
			yAxis: {
				title: {
					text: 'Horas (Hs)'
				}
			},

			plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true
	                }
	            }
	        },
			
			credits: {
				enabled: false
			},
			
			series: [
						
					]
		});
	}

	// Mostrar a lista de projetos cadastrados do BD no HTML
	function selecionarProjeto(){
		dados.child("projects").on("value", function(dadosBanco) {
		 
			var projects = dadosBanco.val();
			
		  	 // Recupera o projeto no HTML
		  	for (var i in projects){
	  			$("#idProjeto").append("<option value='"+i+"'>" +projects[i].name+"</option>");
		 	}
		}); 
	}
	selecionarProjeto();

	$("#idProjeto").on('change', function(){

		var value = this.value;

		dados.on("value", function(dadosBanco) {

			var personProjects = dadosBanco.child('projects').val();
			var person = dadosBanco.child('users').val();

			
			
			for (var i in person){
				if((person[i].project == value) || value == '') {
					$('#idColaboradores form div[data-id='+i+']').show().find('input').prop('checked', true);

				}
				else {
					$('#idColaboradores form div[data-id='+i+']').hide().find('input').prop('checked', false);
				}// fim if
				console.log($('#idColaboradores form div[data-id='+i+'] input').is('checked'));
				if(!$('#idColaboradores form div[data-id='+i+'] input').is('checked')) {
					$('#idColaboradores form div[data-id='+i+'] input').click();
				}
			} // fim for



		}); // fim dados.on
	}); // fim $("#idProjeto").on
/*
	function consultarProjetoColaborador(){
		dados.on("value", function(dadosBanco){

			var personProjects = dadosBanco.child('projects').val();
			var personUsers = dadosBanco.child('users').val();

			console.log(personProjects, personUsers);
		});
	}

	consultarProjetoColaborador();

	function colaboradorPorProjeto(){
		dados.on("value", function(dadosBanco) {

		  var person = dadosBanco.val();
		  	console.log(person);

		  	for (var i in person){
		  		
			  	var colaboradorCheckbox = $('<input type="checkbox" name="Colaboradores" value="'+i+'" data-nome="'+person[i].name+'"/>');
				$("#idColaboradores").append('<label>'+person[i].name+'</label><br>');
				colaboradorCheckbox.on('change', onColaboradorChecked);
				
				adicionaColaboradorNaLista(i, person[i].name);
			}

		}); // Fim dados.on("value", function(dadosBanco)
	} // Fim function popularSelect

*/




	function adicionaColaboradorNaLista(idColaborador, nomeColaborador){
		
		var div = $('<div data-id="'+idColaborador+'"></div>');
		var input = $('<input type="checkbox" name="Colaboradores" value="'+idColaborador+'"  data-nome="'+nomeColaborador+'"/>');
		var label = $('<label>'+nomeColaborador+'</label>');
		input.on('change', onColaboradorChecked);

		div.append(input).append(label);

	 	$('#idColaboradores form').append(div);
	}

	function limpaListaDeColaboradores(){
		$('#idColaboradores form').html('');
	}


}