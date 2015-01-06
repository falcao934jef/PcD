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

	dados.on("value", function(data) {

	  //carregando do banco de dados (Firebase) todos os dados de cada colaborador	{objeto}
	  var person = data.val();

	  //Preenchendo os checkboxes e preenchendo o array de colaboradores para o gráfico.
	  for (var i in person){
	  	var colaboradorCheckbox = $('<input type="checkbox" name="Colaboradores" value="" id="'+i+'" data-nome="'+person[i].name+'"/>');
	  	$("#idColaboradores form").append(colaboradorCheckbox).append('<label>'+person[i].name+'</label><br>');
	  	colaboradorCheckbox.on('change', onColaboradorChecked);

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

		dados.on("value", function(data) {
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
	
	
}