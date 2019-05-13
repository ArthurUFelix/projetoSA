$(document).ready(function() {

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
            // formata os dados e insere no banco
            let dados = {
                cod: $('#productCod').val(),
                desc: $('#productDesc').val(),
                qnt: $('#productQnt').val(),
                val: $('#productVal').val()
            };
            bancoInsert("produtos", dados);
    
            // redireciona o usuário para a tela de estoque
            alert("Dps redirecionar user");
        }
    });

});