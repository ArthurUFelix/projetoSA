$(document).ready(function() {

    VMasker($(".maskMoney")).maskMoney({
        // Decimal precision -> "90"
        precision: 2,
        // Decimal separator -> ",90"
        separator: ',',
        // Number delimiter -> "12.345.678"
        delimiter: '.',
        // Money unit -> "R$ 12.345.678,90"
        unit: 'R$',
        // Money unit -> "12.345.678,90 R$"
        // suffixUnit: 'R$',
        // Force type only number instead decimal,
        // masking decimals with ",00"
        // Zero cents -> "R$ 1.234.567.890,00"
        // zeroCents: true
      });

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    $('#add-product-form').submit(function(event){
        if($('#add-product-form').is(':valid')) {
            event.preventDefault();

            // formata os dados e insere no banco
            let dados = {
                cod: $('#productCod').val(),
                desc: $('#productDesc').val(),
                qnt: $('#productQnt').val(),
                val: parseFloat($('#productVal').val().slice(3).replace(',','.'))
            };
            bancoInsert("produtos", dados);
    
            // redireciona o usuário para a tela de estoque
            alert("Dps redirecionar user");
        }
    });

});