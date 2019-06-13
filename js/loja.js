var banco = getBanco();

/**************
    index.html
***************/
$(document).ready(function() {
    let dadosLoja = banco[0].loja[0];

    $('#lojaName').val(dadosLoja.nome);
    $('#lojaCnpj').val(dadosLoja.cnpj);
    $('#lojaCEP').val(dadosLoja.cep);
    $('#lojaLog').val(dadosLoja.logradouro);
    $('#lojaNumero').val(dadosLoja.numero);
    $('#lojaComp').val(dadosLoja.complement);
    $('#lojaBairro').val(dadosLoja.bairro);
    $('#lojaCidade').val(dadosLoja.cidade);
    $('#lojaEstado').val(dadosLoja.estado);
    $('#lojaPhone').val(dadosLoja.telefone);
    $('#lojaEmail').val(dadosLoja.email);
    $('#lojaUrl').val(dadosLoja.url);
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

        // Se o CEP for válido
        if($('#lojaCEP').hasClass('ready-to-send')) {
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
        } else {
            $('lojaCEP').prop(':invalid')
        }
    });

    // Monitora o input de CEP para buscar o endereço
    $('#lojaCEP').keyup(function() {
        // Remove o erro
        $(this).removeClass('is-invalid is-valid valid-to-send');

        let cep = $(this).val();

        if(cep.length == 8) {
            $.get( "https://viacep.com.br/ws/"+cep+"/json/", function( data ) {
                console.log(data);
                if(data.erro == true) {
                    $('#lojaCEP').addClass('is-invalid');
                } else {
                    $('#lojaCEP').addClass('is-valid valid-to-send');

                    $('#lojaLog').val(data.logradouro);
                    $('#lojaBairro').val(data.bairro);
                    $('#lojaCidade').val(data.localidade);
                    $('#lojaEstado').val(data.uf);
                }
            });
        } else {
            $(this).addClass('is-invalid');
        }
    });
});