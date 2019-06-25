var banco = getBanco();

/**************
    index.html
***************/
$(document).ready(function() {
    let dadosLoja = banco[0].loja[0];

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
    $('#lojaName').val(dadosLoja.nome).trigger('focus');

    $(window).scrollTop(0);
});

/**************
    edit.html
***************/
$(document).ready(function() {
    // Validações e máscaras
    $('#lojaCnpj').cpfcnpj({
        mask: true,
        validate: 'cnpj',
        event: 'keyup',
        handler: 'input#lojaCnpj',
        ifValid: function (input) { input.removeClass("is-invalid"); input.addClass("is-valid"); input.removeAttr('pattern'); },
        ifInvalid: function (input) { input.addClass("is-invalid"); input.removeClass("is-valid"); input.attr('pattern', 'blocked'); }
    });

    var SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    spOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
    };
    
    $('#lojaPhone').mask(SPMaskBehavior, spOptions);

    $('#lojaCEP').mask('00000-000');
    // Fim máscaras

    $('#edit-loja-form').submit(function(event){
        event.preventDefault();

        if($('#edit-loja-form').is(':valid')) {
            
            let dados = {
                nome       : $('#lojaName').val(),
                cnpj       : $('#lojaCnpj').val(),
                cep        : $('#lojaCEP').val(),
                logradouro : $('#lojaLog').val(),
                numero     : $('#lojaNumero').val(),
                complement : $('#lojaComp').val(),
                bairro     : $('#lojaBairro').val(),
                cidade     : $('#lojaCidade').val(),
                estado     : $('#lojaEstado').val(),
                telefone   : $('#lojaPhone').val(),
                email      : $('#lojaEmail').val(),
                url        : $('#lojaUrl').val()
            };
    
            bancoUpdate("loja", 0, dados);
    
            location = location.href.replace("edit", "index");
        }
    });

    // Monitora o input de CEP para buscar o endereço
    $('#lojaCEP').keyup(function() {
        // Remove o erro
        $(this).removeClass('is-invalid is-valid');
        $(this).removeAttr('pattern');

        let cep = $(this).cleanVal();

        if(cep.length == 8) {
            $.get( "https://viacep.com.br/ws/"+cep+"/json/", function( data ) {
                if(data.erro == true) {
                    $('#lojaCEP').addClass('is-invalid');
                    $(this).attr('pattern', 'blocked');

                    $('#lojaLog').val('');
                    $('#lojaBairro').val('');
                    $('#lojaCidade').val('');
                    $('#lojaEstado').val('');

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

            $('#lojaLog').val('');
            $('#lojaBairro').val('');
            $('#lojaCidade').val('');
            $('#lojaEstado').val('');

            return false
        }
    });
});