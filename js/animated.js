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

      $(document).on('click', '#comPagamento', function(){
      if($(this).is(":checked")){
        $(".quantidadeDeHoras").show();
      }
      else{
        $(".quantidadeDeHoras").hide();
      }
    });

    $(document).on('click', "#btnVoltarGerarGrafico", function(){

      $("body").addClass("animated bounceOutDown");

      setTimeout(function(){ 
        window.location.href = "index.html";
      }, 1000);

      
    });

    $(document).on('click', "#btnNovoColaborador", function(){

      $("body").addClass("animated bounceOutDown");

      setTimeout(function(){ 
        window.location.href = "cadastro.html";
      }, 1000);

      
    });