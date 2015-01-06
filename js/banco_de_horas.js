$(document).ready(function(){



	$(document).on('change', '#idColaboradores', function(){
			
			var optionSelected = $("#idColaboradores option:selected");

			//console.log(optionSelected.attr('data-hora'));
			
			resetFormulario();

			$(".saldo_mes_anterior .hora").val(optionSelected.attr('data-hora'));
			$(".saldo_mes_anterior .minuto").val(optionSelected.attr('data-minuto'));
			$(".saldo_mes_anterior .sinal").html(optionSelected.attr('data-sinal'))


			if(optionSelected.attr('data-sinal') == '+'){
				$(".titulo2").show();
			}

		});

		function resetFormulario(){
			$(".minuto, .hora, .total").val('');
			$(".comPagamento").prop('checked', false);
			$(".titulo2, .titulo7").hide();
			$(".saldo_mes_anterior .sinal").html('');
		}

		//Sintaxe jQuery
		//$(document).on('click', '#comPagamento', function(){});

		$('.comPagamento').on('click', function(){
			if($(this).is(":checked")){
				$(".titulo7").show();
			}
			else{
				$(".titulo7").hide();
			}
		});

	function plus()
	{
		
		var sinalDeSaldoMesAnteriorPositivo = $('.saldo_mes_anterior .sinal').text() == '+'; //sinal Positivo
		var sinalDeSaldoMesAnteriorNegativo = $('.saldo_mes_anterior .sinal').text() == '-'; //sinal Negativo

		var sinalDeSaldoMesAtualPositivo = $('.saldo_mes_atual .sinal').text() == '+';
		var sinalDeSaldoMesAtualNegativo = $('.saldo_mes_atual .sinal').text() == '-';

		var saldoAnteriorHora = $('.saldo_mes_anterior .hora').val(); //hora
		var saldoAnteriorMinuto = $('.saldo_mes_anterior .minuto').val();// minuto

		var saldoAtualHora = $('.saldo_mes_atual .hora').val(); // hora
		var saldoAtualMinuto = $('.saldo_mes_atual .minuto').val(); // minuto

		var qtsHorasHora = $('.quantidade_de_horas .hora').val(); //  hora
		var qtsHorasMinuto = $('.quantidade_de_horas .minuto').val(); //  minuto

		saldoAnteriorTOTAL = (saldoAnteriorHora * 3600) + (saldoAnteriorMinuto * 60); // transformando Hora e Minuto em Segundos
		saldoAtualTOTAL = (saldoAtualHora * 3600) + (saldoAtualMinuto * 60); // transformando Hora e Minuto em Segundos
		qtsHorasTOTAL = (qtsHorasHora * 3600) + (qtsHorasMinuto * 60); // transformando Hora e Minuto em Segundos

		if(sinalDeSaldoMesAnteriorNegativo){
			saldoAnteriorTOTAL = -saldoAnteriorTOTAL;
		}

		if(sinalDeSaldoMesAtualNegativo){
			saldoAtualTOTAL = -saldoAtualTOTAL;
		}

		if(sinalDeSaldoMesAnteriorPositivo){ //Com Pagamento
			totalFinal(saldoAtualTOTAL, saldoAnteriorTOTAL, qtsHorasTOTAL);
		}else{ //Sem Pagamento
			totalFinal(saldoAtualTOTAL, saldoAnteriorTOTAL,0);
		}
	}

	function totalFinal(_saldoAtualTOTAL, _saldoAnteriorTOTAL, _qtsHorasTOTAL){

		var saldoAnteriorTOTAL, saldoAtualTOTAL, qtsHorasTOTAL, saldoFinalTOTAL, Hora, Minuto;

		saldoFinalTOTAL = ((_saldoAtualTOTAL + _saldoAnteriorTOTAL) - _qtsHorasTOTAL); // calculando a quantidade de minutos (subtraindo)

		Hora = parseInt(saldoFinalTOTAL / 3600); // Descobrindo o valor da Hora  A funcao parseInt() tranforma a string em inteiro
		Minuto = (saldoFinalTOTAL % 3600); // Descobrindo a quantidade de segundos dos minutos
		Minuto = parseInt(Minuto / 60); // Descobrindo o valor dos minutos

		if ((Hora >= 0) && (Hora < 10)) // Formatando a Hora para 00
		{
		  Hora = ("0"+ Hora);
		}

		if(Minuto < 0) {
			Minuto = -Minuto;
		}

		if ((Minuto >= 0) && (Minuto < 10)) // Formatando a Minuto para 00
		{
		  Minuto = ("0"+ Minuto);
		}

		$("#total").val((Hora +":"+ Minuto));
	}

	$('.hora, .minuto').on("input",function(){	
		plus();
	});

	$('.saldo_mes_atual .sinal').on("click",function(){
		mudarSinal($(this));
		plus();
	});

	$('.limpar').on("click",function(){
		resetFormulario();
	});

	function mudarSinal($span){
		if($span.text() == '+'){
			$span.html('-');
		}else{
			$span.html('+');
		}
	}
});
