/*Título: Projeto Banco de Horas
* Descrição: Este projeto destina-se para fazer o acompanhamento das horas dos colaboradores do
* Instituto de Pesquisas Eldorado, onde são armazenadas todas as horas com os seus devidos cálculos
* atualizado, onde os seus respectivos Líder de Projetos consegue fazer todo o acompanhamento.
* Desenvolvedores: Thales, Rafael, Bruno, Marcos, Lucas
* Data: 01/12/2014
*/

//Carrega os dados do html no Firebase
window.onload = function(){

	//Acessa o banco de dados Firebase
	var dados = new Firebase("https://blistering-heat-9478.firebaseio.com");
	

	$('#form').submit(function(event){
		

		console.log ($(this).serialize());
		var dadosFormulario = $(this).serializeArray();
		var arrayFormulario = {};

		for(var index in dadosFormulario){
			arrayFormulario [dadosFormulario[index].name] = dadosFormulario[index].value;
		}
		
		var sinalAtual = $('#sinalAtual').text();
		var sinalAnterior = $('#sinalAnterior').text();

		var saldoFinal = $('#total').val();
		var horasPagas = arrayFormulario.qtsHorasHora + ':' + arrayFormulario.qtsHorasMinuto;
		var saldoAtual = arrayFormulario.saldoHoras + ':' + arrayFormulario.saldoMinutos;

		if (isNegativo(saldoFinal)){

			alert("Não é possível realizar o pagamento, devido as horas ser negativas!");
			event.preventDefault();
		}else{

			atualizaDadosPorColaborador(arrayFormulario.idColaborador, dataSemDia(arrayFormulario.data),
			 							sinalAtual, sinalAnterior,horasPagas, saldoFinal, saldoAtual);
		}

		
	});

	function atualizaDadosPorColaborador(idColaborador, data, sinalAtual, sinalAnterior, horasPagas, saldoFinal,saldoAtual){
	   // Recupera o colaborador do Firebase
		var workTimes = dados.child('users').child(idColaborador).child('workTime');
		
		workTimes.once("value", function(workTime){ 
			console.log(sinalAtual, sinalAnterior);
			console.log(workTime);
			
			saldoAtual = sinalAtual == '-' ? '-'+saldoAtual : saldoAtual;

			//Falta atualizar o formulário e firebase
			var workTimeData = workTime.val();
			var validador = false;
			console.log(workTimeData);
			for(var index in workTimeData){
				console.log(workTimeData[index].date,data);
				//Atualiza formulario
				if(workTimeData[index].date.trim() == data.trim()){ 
					dados.child('users').child(idColaborador).child('workTime').child(index).set({'balance': saldoAtual, 'date': data, 'payed': horasPagas});
					validador = true;
					alert("Dados atualizados com sucesso!");
					break;
				} 
			}

			if (!validador){
				inserirHorasTrabalhadasPorColaborador(idColaborador, data, saldoFinal, horasPagas);
				alert("Dados inseridos com sucesso!");
			}

		});
	}
	//Update 
	//dados.child('persons').child(1).child('workTime').child(0).set({ ano: 2010, mes: 05, saldo: 52 });

	//Insere colaborador no banco de dados JSON
	function inserirColaborador(nome, data, saldo){

		// Recebe os dados da data e o saldo de horas
		var newWorkTime = {"date": data, "balance": saldo};

		/*
		* Dados push armazena dados no Firebase
		* Nome: armazena os nomes no banco de dados
		* WorkTime: Recebe o newWorkTime citado acima
		*/
		dados.push({
			"name" : nome,
			"workTime": [newWorkTime]
		}); // Fim dados.push

	}; // Fim function inserirColaborador

	//Insere colaborador no banco de dados JSON
	function inserirColaborador(nome, data, saldo){

		// Recebe os dados da data e o saldo de horas
		var newWorkTime = {"date": data, "balance": saldo};

		/*
		* Dados push armazena dados no Firebase
		* Nome: armazena os nomes no banco de dados
		* WorkTime: Recebe o newWorkTime citado acima
		*/
		dados.push({
			"name" : nome,
			"workTime": [newWorkTime]
		}); // Fim dados.push

	}; // Fim function inserirColaborador

	/* Função responsável para inserir os dados no banco de dados
	* idColaborador: Recebe o id do colaborador do Firebase
	* data: Recebe a data do colaborador do Firebase
	* saldo: Recebe o saldo do colaborador do Firebase
	* horasPagas: Recebe as horas pagas do colaborador do Firebase
	*/ 
	function inserirHorasTrabalhadasPorColaborador(idColaborador, data, saldo, horasPagas){
		
		// Recupera o colaborador do Firebase
		var recuperaColaborador = dados.child('users').child(idColaborador).child('workTime');
		
		// Inserir os dados de data, saldo e horasPagas para o colaborador
		recuperaColaborador.push({
			"date": data,
			"balance": saldo,
			"payed": horasPagas
		}); // Fim recuperaColaborador

	} // Fim function inserirHorasTrabalhadasPorColaborador

	/*inserirHorasTrabalhadasPorColaborador("-JctJMFQ_CsJEzqRpYHB", "2014-01", "03:15", "00:00");
	inserirHorasTrabalhadasPorColaborador("-JctJMFQ_CsJEzqRpYHB", "2014-02", "09:19", "09:30");
	inserirHorasTrabalhadasPorColaborador("-JctJMFQ_CsJEzqRpYHB", "2014-03", "01:10", "01:00");
	inserirHorasTrabalhadasPorColaborador("-JctJMFQ_CsJEzqRpYHB", "2014-04", "00:01", "00:00");*/
	
	/*Chamadas para inserir o funcionario.
	inserirColaborador("Fernando", "2012-03-03", "12:32");
	inserirColaborador("Rafael", "2013-07-15", "75:32");
	inserirColaborador("Thales", "2013-09-03", "80:32");
	inserirColaborador("Mauricio", "2013-07-03", "18:32");
	inserirColaborador("Lukita", "2013-07-03", "12:32");*/


	/*
	* Populando o elemento <select> com os <option>
	* Função consulta dados no banco e insere no select os valores recuperados.
	*/
	function popularSelect(){
		dados.child('users').on("value", function(dadosBanco) {
		 
		  var person = dadosBanco.val();
		  	  
		  	  for (var i in person){	  	
			  	$("#idColaboradores").append("<option value='"+i+"'>"
			  		+person[i].name+"</option>");
			  }

		}); // Fim dados.on("value", function(dadosBanco)
	} // Fim function popularSelect

	//Chamando a função para ser executada
	popularSelect();

	/*
	 * @param {string} data Recupera a data '2000-10-10'
	 */
	function recuperarSaldoMesAnterior(data){
		
		data = data.split('-');

		var ano = parseInt(data[0]);
		var mes = parseInt(data[1]);
		var dia = parseInt(data[2]);
		
		/*
		* Caso o primeiro mês seja janeiro, substraia o ano (para o anterior) e atribua o mês
		* para dezembro, caso contrário irá atribuir para o mês anterior.
		*/
		if (mes == 1){
			ano--;
			mes = 12;
		}else{
			mes--;
		}
		
		// O retorno será data formatada conforme exemplo:'2000-10-10'.
		return formateData(ano + '-' + mes + '-' + dia);

	}

	/*
	* Formatar a data para o padrão:
	* @param {String} data: '2000-01-01'
	*/
	function formateData(data) {

		// Separa a data com o intervalo "-"
		data = data.split('-');

		var ano = parseInt(data[0]);
		var mes = parseInt(data[1]);
		var dia = parseInt(data[2]);
		
		// Caso o mês seja entre janeiro e outubro recebe o primeiro valor de zero
		if(mes < 10) {
			mes = '0'+ mes;
		}

		// Caso o dia entre 0 e 9 recebe o primeiro valor de zero
		if(dia < 10) {
			dia = '0'+ dia;
		}

		return ano + '-' + mes + '-' + dia;

	} // Fim function formateData

	// Funcão retorna a data sem o dia.	
	function dataSemDia(data) {
		
		return data.replace(/-\d{2}$/, '');

	}

	/* Função recupera o saldo do colaborador em um determinado mês selecionado.
	* idColaborador = recebe o colaborador do banco de dados.
	* data = recebe a data selecionada do input.
	* callback = retorna o tempo de trabalho do colaborador selecionado.
	*/
	function recuperaSaldoPorDataDoColaborador(idColaborador, data, callback) {
		
		// dbworkTime = recupera os dados do workTime do banco de dados em um array multidimensional
		var dbworkTime = dados.child('users').child(idColaborador).child("workTime");
		
		// recupera a data do input e a data do banco de dados.
		dbworkTime.on('value', function(listaTempoTrabalho){
			
			// recebe o dados todos os valores do Firebase e armazena na variável.
			listaTempoTrabalho = listaTempoTrabalho.val();
			
			// percorrer a listaTempoTrabalho para fazer a comparação entre as datas selecionadas.
			for (var index in listaTempoTrabalho) {
				// faz a comparação da data do input com a data do Firebase.
				if (listaTempoTrabalho[index].date == data) {
					// função saldo
					callback(listaTempoTrabalho[index]);

				} // Fim de if

			} // Fim de for

		}); // Fim dbworkTime.on('value', function(listaTempoTrabalho)

	} // Fim function recuperaSaldoPorDataDoColaborador




    /* 
    * Quando houver alguma mudança no input calendar, irá executar os passos abaixo:
    * Quando alterar o colaborador irá chamar a função para limpar o formulário
    * Insere o saldo de horas de cada colaborador
    * Recupera o saldo de horas de cada colaborador
    * Retorna o saldo final
    */
	$("#calendar").on('change', function(){
		
		var idColaborador = $('#idColaboradores').val();
		var dataAnterior = recuperarSaldoMesAnterior(this.value);
		
		// Limpa os dados do colaborador selecionado anteriormente
		resetFormulario();

		/* Insere o saldo de horas do colaborador
		* @param {String} registro único do colaborador
		* @param {String} recebe uma data inicial
		* @param {String} recebe uma data final
		* @param {function} recebe o saldo final do colaborador
		*/ 
		saldoDeHorasPorColaborador(idColaborador,"1990-01-01", dataAnterior, function(saldo){
			
			saldo = saldo.split(':');

			/* Insere o saldo de horas do colaborador no formulário
			* @param {String} insere a hora do colaborador
			* @param {String} insere o minuto do colaborador
			*/ 
			defineCamposMesAnterior(saldo[0], saldo[1]);
			
			/*
			* Caso saldo seja negativo, o checkBox será ocultado caso contrário será apresentado
			*/
			if(saldo[0][0] == '-'){
				$(".checkBox").hide();
			}else{
				$(".checkBox").show();
			}

		}); // Fim de saldoDeHorasPorColaborador

		/* 
		* Recupera o saldo do colaborador 
		* @param {String} recebe o nome do colaborador do Firebase
		* @param {function} função retorna da data sem o dia, somente mês e ano
		* @param {function} função retorna o saldo com horas e minutos
		*/
 		recuperaSaldoPorDataDoColaborador(idColaborador, dataSemDia(this.value), function(saldo){
			
 			// Recupera o dado do banco de dados de balance
			var saldoRecebeBalance = saldo.balance.split(':');
			// Recupera o dado do banco de dados de payed
			var saldoRecebePayed = saldo.payed.split(':');

			/*
			* Define os dados para o mês atual
			* saldoRecebeBalance[0] = recupera a hora com negativo ou positivo 
			* saldoRecebeBalance[1] = recupera o minuto.
			*/
			defineCamposMesAtual(saldoRecebeBalance[0],saldoRecebeBalance[1]);

			// Faz comparação de saldo de horas ou de minutos de payed maior que 0
			if(saldoRecebePayed[0] > 0 || saldoRecebePayed[1] > 0 ){

				// Função define campos de pagamento com horas e minutos
				defineCamposPagamento(saldoRecebePayed[0], saldoRecebePayed[1]);
			
			}

			/*
			* Retorna o saldo total final
			*/
			plus();

		}); // Fim de recuperaSaldoPorDataDoColaborador

	}); // Fim de $("#calendar").on('change', function()

	/* Função define o campo de mes anterior
	* @param {String} recebe a hora do colaborador do Firebase
	* @param {String} recebe o minuto do colaborador do Firebase
	*/
	function defineCamposMesAnterior(hora, minuto) {
		
		// Hora de string converte para o número inteiro
		hora = parseInt(hora);
		// Minuto de string converte para o número inteiro
		minuto = parseInt(minuto);
		// Se a hora for maior que zero e retorna positivo, caso contrário, negativo.
		var sinal = (hora > 0) ? '+' : '-';

		// Remover a hora negativa e gera em span
		if(hora<0){
			hora=-hora; 
		} // Fim if
  
		// Insere o 'sinal' no saldo mes anterior
		$('.saldo_mes_anterior .sinal').html(sinal);
		// Insere a hora no saldo mes anterior
		$('#saldoMesAnteriorHora.hora').val(hora);
		// Insere o minuto no saldo mes anterior
		$('#saldoMesAnteriorMin.minuto').val(minuto);

	} // Fim function defineCamposMesAnterior

	/* Função define o campo de mes atual
	* @param {String} recebe a hora do colaborador do Firebase
	* @param {String} recebe o minuto do colaborador do Firebase
	*/
	function defineCamposMesAtual(hora, minuto) {

		// Hora de string converte para o número inteiro
		hora = parseInt(hora);
		// Minuto de string converte para o número inteiro
		minuto = parseInt(minuto);
		// Se a hora for maior que zero e retorna positivo, caso contrário, negativo.
		var sinal = (hora > 0) ? '+' : '-';

		// Remover a hora negativa e gera em span
		if(hora<0){
			hora=-hora; 
		} // Fim if

		// Insere o 'sinal' no saldo mes atual
		$('.saldo_mes_atual .sinal').html(sinal);
		// Insere a hora' no saldo mes atual
		$('.saldo_mes_atual .hora').val(hora);
		// Insere o minuto no saldo mes atual
		$('.saldo_mes_atual .minuto').val(minuto);

	} // Fim function defineCamposMesAtual

	/* Função define o campo de pagamento
	* @param {String} recebe a hora do colaborador do Firebase
	* @param {String} recebe o minuto do colaborador do Firebase
	*/

	function defineCamposPagamento(hora, minuto) {

		// Hora de string converte para o número inteiro
		hora = parseInt(hora);
		// Minuto de string converte para o número inteiro
		minuto = parseInt(minuto);
		
		// Insere a hora na quantidades de horas
		$('.quantidade_de_horas .hora').val(hora);
		// Insere o minuto na quantidades de horas
		$('.quantidade_de_horas .minuto').val(minuto);

		// Em caso positivo e chama a função para habilitar o parâmetro de pagamento
		habilitaCheckBoxPagamento();

	} // Fim function defineCamposPagamento


	/* 
    * Quando houver alguma mudança no input colaboradores, irá executar os passos abaixo:
    * Desabilitará o comboBox quando alterar funcionário para o campo vazio
    * Recupera o workTime do Banco de dados
    * Verifica qual o menor ano e mes para bloquear calendário
    * Retorna o saldo final
    */
	$('#idColaboradores').on('change', function(){

		// Seta o valor do colaborador
		var colaborador = this.value;
		var workTime;
		var setMes = "";
		var setAno = "";
		var minAno = "2500";
		var minMes = "13";
		var menorMes="";
		var saldoAnterior = "";		
		// Retorna o idColaboradores do input
		var select = $(this);

		// Retorna os valores do calendário em branco 
		$("#calendar").val('');
		
		resetFormulario();		

		// Caso não exista colaborador selecionado desabilita comboBox do calendário
		if(select.val() == ""){
			
			// Desabilitar o calendário e retorna a seleção 'bloqueado'
			$("#calendar").prop("disabled", true);			

			return;

		}
		
		// Armazena os dados de workTime
		var dbworkTime = dados.child('users').child(colaborador).child("workTime");

		// Recuperando o dado workTime do colaborador selecionado
		dbworkTime.on('value', function(workTime){

			// Armazena o saldo de horas trabalhadas do workTime
			workTime = workTime.val();

			// Percorrer o workTime do Colaborador selecionado
			for(var w in workTime){
				
				var dataColaborador = new Date(workTime[w].date);
					
				// Pegar sempre o menor ano.
				if(dataColaborador.getUTCFullYear() < minAno){
					
					// Salvando o menor ano.
					minAno = dataColaborador.getUTCFullYear();

					// Pegar sempre o menor mês.
					if(dataColaborador.getUTCMonth() < minMes){

					  // Salvando o menor mês.
					  minMes = dataColaborador.getUTCMonth();
					  saldoAnterior = workTime[w].balance;

					}

				}
				
			}// Fim for

			/*
			* Verifica se o mes é menor que 10, caso positivo adiciona o zero a esquerda
			* caso contrário imprime na tela o valor normal
			*/
			if(minMes <10){
				menorMes = minAno + "-" + "0"+ 1 + "-" + "10";
			}else{
				menorMes = minAno + "-" +minMes + "-" + "10";
			}

			// Irá verificar qual o menor mês e ano do funcionário e irá bloquear a datas anteriores
			$("#calendar").datepicker( "option", "minDate", menorMes);
			$("#calendar").prop("disabled", false);	

		}); // Fim dbworkTime.on('value', function(workTime)
		
	}); // Fim $('#idColaboradores').on('change', function()

	
	// Função irá verificar qual será a data atual para ser a data limite no calendário
	function dataMax(){

		// Armaneza uma nova data para a variável dataMax
		var dataMax = new Date();
		/* Armaneza o mes atual na variável month o +1 serve para adicionar uma posição, 
		* pois sempre inicializa com o "0".
		*/
		var month = dataMax.getUTCMonth() + 1; //months from 1-12
		// Armaneza o dia atual para a variável day e adiciona mais dois dias para bloquear o calendário
		var day = dataMax.getUTCDate()+2;
		// Armaneza o ano atual para a variável year 
		var year = dataMax.getUTCFullYear();
		// Irá apresentar a data na variável fullDate no modelo "2000-01-01"
		var fullDate = year + "-" + month + "-" + day;

		// Irá bloquear o calendário conforme a data armazenada no fullDate
		$("#calendar").datepicker("option","maxDate", fullDate);
	}
	
	// Limpa o formulário e desabilita o checkBox
	function resetFormulario(){

			$(".minuto, .hora, #total").val('');
			$(".saldo_mes_anterior .sinal").html('');
			$("#qntHorasHora, #qntHorasMin").val('00');
			desabilitaCheckBoxPagamento();
	}

	// Habilita o checkBox
	function habilitaCheckBoxPagamento(){

		$(".comPagamento").prop('checked', true);
		$(".quantidadeDeHoras, .checkBox").show();
	}

	// Desabilita o checkBox
	function desabilitaCheckBoxPagamento(){

		$(".comPagamento").prop('checked', false);
		$(".quantidadeDeHoras, .checkBox").hide();

	}

	// Sintaxe jQuery
	// $(document).on('click', '#comPagamento', function(){});

	/*
	* Recupera o campo com pagamento quando for clicado, 
	* e verifica se já possuir horas no banco irá mostrar 
	* o parametro com pagamento caso irá ocultar
	*/
 	$('.comPagamento').on('click', function(){
		
		if($(this).is(":checked")){
			$(".quantidadeDeHoras").show();
		}
		else{
			$(".quantidadeDeHoras").hide();
		}

	});

 	//Função de soma entre horas e minutos
	function plus()
	{
		
		var sinalDeSaldoMesAnteriorPositivo = $('.saldo_mes_anterior .sinal').text() == '+';
		var sinalDeSaldoMesAnteriorNegativo = $('.saldo_mes_anterior .sinal').text() == '-';

		var sinalDeSaldoMesAtualPositivo = $('.saldo_mes_atual .sinal').text() == '+';
		var sinalDeSaldoMesAtualNegativo = $('.saldo_mes_atual .sinal').text() == '-';

		var saldoAnteriorHora = $('.saldo_mes_anterior .hora').val();
		var saldoAnteriorMinuto = $('.saldo_mes_anterior .minuto').val();

		var saldoAtualHora = $('.saldo_mes_atual .hora').val();
		var saldoAtualMinuto = $('.saldo_mes_atual .minuto').val();

		var qtsHorasHora = $('.quantidade_de_horas .hora').val();
		var qtsHorasMinuto = $('.quantidade_de_horas .minuto').val();

		// transformando Hora e Minuto em Segundos
		saldoAnteriorTOTAL = (saldoAnteriorHora * 3600) + (saldoAnteriorMinuto * 60);
		 // transformando Hora e Minuto em Segundos
		saldoAtualTOTAL = (saldoAtualHora * 3600) + (saldoAtualMinuto * 60);
		// transformando Hora e Minuto em Segundos
		qtsHorasTOTAL = (qtsHorasHora * 3600) + (qtsHorasMinuto * 60); 

		if(sinalDeSaldoMesAnteriorNegativo){
			saldoAnteriorTOTAL = -saldoAnteriorTOTAL;
		}

		if(sinalDeSaldoMesAtualNegativo){
			saldoAtualTOTAL = -saldoAtualTOTAL;
		}

		if(sinalDeSaldoMesAnteriorPositivo){ 
			totalFinal(saldoAtualTOTAL, saldoAnteriorTOTAL, qtsHorasTOTAL);
		}else{
			totalFinal(saldoAtualTOTAL, saldoAnteriorTOTAL,0);
		}

	} // Fim plus()

	

	function isNegativo(saldoFinal){

		//se tem pagamento e saldo é negativo retorna true
		return $('#checkBoxPagamento').is(':checked') && saldoFinal.indexOf('-') != -1;
	
	}

	// Função formatando a Hora e Minuto
	function formatarHoras(Hora, Minuto){

		// Formatando a Hora para '00'
		if ((Hora >= 0) && (Hora < 10)){
		  Hora = ("0"+ Hora);
		}
		// Formatando a Hora para '-00'
		if (((Hora <= 0) && (Hora > -10) && (Minuto < 0)) || ((Hora <= 0) && (Hora > -10) && (Minuto <= 0))
			&&((Hora != 0) || (Minuto!= 0))){
		  Hora = ("-0"+ -Hora);
		}

		// Convertendo o minuto negativo para '00'
		if(Minuto < 0){
			Minuto = -Minuto;
		}
		// Formatando o minuto para '00'
		if ((Minuto >= 0) && (Minuto < 10)){
		  Minuto = ("0"+ Minuto);
		}

		return (Hora + ':' + Minuto);

	} // Fim function formatarHoras

	/* Função de saldo de horas por colaborador
	* @param {String} recupera o idColaborador do Firebase
	* @param {String} recupera a dataInicial do Firebase
	* @param {String} recupera a data atual na dataFinal
	* @param {function} retorna o tempo de trabalho do colaborador selecionado. 
	*/
	function saldoDeHorasPorColaborador(idColaborador,dataInicial, dataFinal, callback){
		
		// Recupera os dados do workTime do banco de dados
		dados.child('users').child(idColaborador).child('workTime').on('value',function(horasTrabalhadas){
			
			horasTrabalhadas = horasTrabalhadas.val();
			var saldoDeHoras = [];
			dataInicial = new Date(dataInicial);
			dataInicial.setDate(1);
			dataFinal = new Date(dataFinal);
			dataFinal.setDate(1);

			for(var index in horasTrabalhadas){
				
				var dataAtual = new Date(horasTrabalhadas[index].date);
				dataAtual.setDate(1);
				
				// Faz com Data Atual no intervalo
				if(dataAtual.getTime() >= dataInicial.getTime() && dataAtual.getTime() <= dataFinal.getTime()){
					
					saldoDeHoras.push(horasTrabalhadas[index].balance);	
					saldoDeHoras.push("-" + horasTrabalhadas[index].payed);	

				} // Fim if

			} // Fim for

			callback(calculaListaDeHoras(saldoDeHoras));

		});	// Fim dados.child

	} // Fim function saldoDeHorasPorColaborador

	/* Funcção de calcula lista de horas e retorna a hora e minuto formatada
	* @param {String} recupera os dados calculados entre balance e payed
	*/
	function calculaListaDeHoras(lista){
		
		var saldo = 0;

		for(var i=0;i<lista.length;i++){
			
			var tempo = lista[i].split(':');
			var horas = parseInt(tempo[0]);
			var minuto = parseInt(tempo[1]);

			if (horas < 0) {

				saldo -= (-horas * 3600) + (minuto * 60); 
			
			}else{

				saldo += (horas * 3600) + (minuto * 60); 
			};
			
		}

		var horas1 = parseInt(saldo / 3600);
		var minutos1 = parseInt(parseInt(saldo % 3600)/60);
		
		return formatarHoras(horas1, minutos1);
			
	}
	/* Funcao de total Final, insere a hora e minuto formatada no saldo Final
	* @param {String} recupera o saldo atual total
	* @param {String} recupera o saldo anterior total
	* @param {String} recupera a quantidades de horas total
	*/
	function totalFinal(_saldoAtualTOTAL, _saldoAnteriorTOTAL, _qtsHorasTOTAL){

		var saldoAnteriorTOTAL, saldoAtualTOTAL, qtsHorasTOTAL, saldoFinalTOTAL, Hora, Minuto;
		
		saldoFinalTOTAL = ((_saldoAtualTOTAL + _saldoAnteriorTOTAL) - _qtsHorasTOTAL); 
		Hora = parseInt(saldoFinalTOTAL / 3600);
		Minuto = (saldoFinalTOTAL % 3600);
		Minuto = parseInt(Minuto / 60); 
		
		$("#total").val(formatarHoras(Hora,Minuto));

	}

	// Cada vez que atualizar a hora e minuto é calculado
	$('.hora, .minuto').on("input",function(){	
		plus();
	});

	// Altera o sinal no formulário
	$('.saldo_mes_atual .sinal').on("click",function(){
		mudarSinal($(this));
		plus();
	});

	// Limpa o formulário
	$('.limpar').on("click",function(){
		
		if (confirm('Deseja limpar as informações?')) {
		    resetFormulario();
		}else{
			event.preventDefault();
		}
	});

	// Função para alterar o sinal
	function mudarSinal($span){

		if($span.text() == '+'){
			$span.html('-');
		}else{
			$span.html('+');
		}

	}
};

	$(function() {
	    $("#calendar").datepicker({
	        dateFormat: 'yy-mm-dd',
	        dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
	        dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
	        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
	        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
	        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
		   		
	        changeMonth: true,
	        changeYear: true,

	        maxDate: 'now'

		});
	});
