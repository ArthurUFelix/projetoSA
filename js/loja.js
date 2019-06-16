var banco = getBanco();

/**************
    index.html
***************/
$(document).ready(function() {
    let dadosLoja = banco[0].loja[0];

    $('#lojaName').val(dadosLoja.nome).trigger('focus');
    $('#lojaCnpj').val(dadosLoja.cnpj).trigger('focus');
    $('#lojaCEP').val(dadosLoja.cep).trigger('focus');
    $('#lojaLog').val(dadosLoja.logradouro).trigger('focus');
    $('#lojaNumero').val(dadosLoja.numero).trigger('focus');
    $('#lojaComp').val(dadosLoja.complement).trigger('focus');
    $('#lojaBairro').val(dadosLoja.bairro).trigger('focus');
    $('#lojaCidade').val(dadosLoja.cidade).trigger('focus');
    $('#lojaEstado').val(dadosLoja.estado).trigger('focus');
    $('#lojaPhone').val(dadosLoja.telefone).trigger('focus');
    $('#lojaEmail').val(dadosLoja.email).trigger('focus');
    $('#lojaUrl').val(dadosLoja.url).trigger('focus');
});

/**************
    edit.html
***************/
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
    
    $('#edit-loja-form').submit(function(event){
        event.preventDefault();

        if($('#edit-loja-form').is(':valid')) {
            // formata os dados e insere no banco
            let dados = {
                nome: $('#lojaName').val(),
                cnpj: $('#lojaCnpj').val(),
                cep: $('#lojaCEP').val(),
                logradouro: $('#lojaLog').val(),
                numero: $('#lojaNumero').val(),
                complement: $('#lojaComp').val(),
                bairro: $('#lojaBairro').val(),
                cidade: $('#lojaCidade').val(),
                estado: $('#lojaEstado').val(),
                telefone: $('#lojaPhone').val(),
                email: $('#lojaEmail').val(),
                url: $('#lojaUrl').val()
            };
    
            // Atualiza os dados da loja, estando eles vazios ou n
            bancoUpdate("loja", 0, dados);
    
            // redireciona o usuário para a tela de estoque
            window.location = window.location.href.replace("edit", "index");
        }
    });

    // Monitora o input de CEP para buscar o endereço
    $('#lojaCEP').keyup(function() {
        // Remove o erro
        $(this).removeClass('is-invalid is-valid');
        $(this).removeAttr('pattern');

        let cep = $(this).val();

        if(cep.length == 8) {
            $.get( "https://viacep.com.br/ws/"+cep+"/json/", function( data ) {
                if(data.erro == true) {
                    $('#lojaCEP').addClass('is-invalid');
                    $(this).attr('pattern', 'blocked');

                    return false
                } else {
                    $('#lojaCEP').addClass('is-valid');

                    $('#lojaLog').val(data.logradouro).trigger('focus');
                    $('#lojaBairro').val(data.bairro).trigger('focus');
                    $('#lojaCidade').val(data.localidade).trigger('focus');
                    $('#lojaEstado').val(data.uf).trigger('focus');

                    return true
                }
            });
        } else {
            $(this).addClass('is-invalid');
            $(this).attr('pattern', 'blocked');

            return false
        }
    });
});