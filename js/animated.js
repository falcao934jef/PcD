  $(document).on('click', '#comPagamento', function(){
      if($(this).is(":checked")){
        $(".quantidadeDeHoras").show();
      }
      else{
        $(".quantidadeDeHoras").hide();
      }
    });

    $(document).on('click', "#btnGerarGrafico", function(){

      $("body").addClass("animated bounceOutDown");

      setTimeout(function(){ 
        window.location.href = "grafico.html";
      }, 1000);
      
    });

    $(document).on('click', "#btnVoltarGerarGrafico", function(){

      $("body").addClass("animated bounceOutDown");

      setTimeout(function(){ 
        window.location.href = "index.html";
      }, 1000);

      
    });

    $(document).on('click', ".idprincipalMenu", function(){

      $("body").addClass("animated bounceOutDown");

      setTimeout(function(){ 
        window.location.href = "index.html";
      }, 1000);

      
    });

    $(document).on('click', ".idcolaboradoresMenu", function(){

      $("body").addClass("animated bounceOutDown");

      setTimeout(function(){ 
        window.location.href = "colaborador.html";
      }, 1000);

      
    });

    $(document).on('click', ".idgraficoMenu", function(){

      $("body").addClass("animated bounceOutDown");

      setTimeout(function(){ 
        window.location.href = "grafico.html";
      }, 1000);

      
    });