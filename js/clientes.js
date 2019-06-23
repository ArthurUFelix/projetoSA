var banco = getBanco();

/**************
    create.html
***************/
$(document).ready(function() {
    $('#clientCPF').cpfcnpj({
        mask: true,
        validate: 'cpf',
        event: 'keyup',
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
    
    $('#clientPhone').mask(SPMaskBehavior, spOptions);

    $('#clientCEP').mask('00000-000');

    $('#add-client-form').submit(function(event){
        if($('#add-client-form').is(':valid')) {
            event.preventDefault();

            // formata os dados e insere no banco
            let dados = {
                name: $('#clientName').val(),
                cpf: $('#clientCPF').val(),
                cep: $('#clientCEP').val(),
                logradouro: $('#clientLog').val(),
                numero: $('#clientNumero').val(),
                complemento: $('#clientComp').val(),
                bairro: $('#clientBairro').val(),
                cidade: $('#clientCidade').val(),
                estado: $('#clientEstado').val(),
                phone: $('#clientPhone').val(),
                email: $('#clientEmail').val()
            };
            bancoInsert("clientes", dados);
    
            // redireciona o usuário para a tela de estoque
            location = location.href.replace("create", "index");
        }
    });

    // Monitora o input de CEP para buscar o endereço
    $('#clientCEP').keyup(function() {
        // Remove o erro
        $(this).removeClass('is-invalid is-valid');
        $(this).removeAttr('pattern');

        let cep = $(this).cleanVal();

        if(cep.length == 8) {
            $.get( "https://viacep.com.br/ws/"+cep+"/json/", function( data ) {
                if(data.erro == true) {
                    $('#client').addClass('is-invalid');
                    $(this).attr('pattern', 'blocked');

                    return false
                } else {
                    $('#clientCEP').addClass('is-valid');

                    $('#clientLog').val(data.logradouro).trigger('focus');
                    $('#clientBairro').val(data.bairro).trigger('focus');
                    $('#clientCidade').val(data.localidade).trigger('focus');
                    $('#clientEstado').val(data.uf).trigger('focus');

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

/**************
    index.html
***************/
$(document).ready(function(){
    if(banco) {
        let clientes = banco[0].clientes;
        let tabelaClientes = $('#tabelaClientes tbody');

        tabelaClientes.text('');
        clientes.forEach(function(item, index){
            tabelaClientes.append("<tr><th scope='row'>"+item.name+"</th><td>"+item.bairro+". "+item.cidade+", "+item.estado+".</td><td>"+item.phone+"</td><td>"+item.email+"</td><td><i onclick='deletarCliente("+index+")' class='material-icons color-red'>delete</i><i onclick='editarCliente("+index+")' class='material-icons color-blue'>border_color</i></td></tr>");
        });
    }
});

function deletarCliente(id) {
    swal({
        title: "Você tem certeza?",
        text: "Não será possível recuperar o dado apagado!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            bancoDelete('clientes', id);

            window.location.reload();
        }
    });
}

function editarCliente(id) {
    location = location.href.replace("index", "edit") + "?client=" + id;
}

/**************
    edit.html
***************/
$(document).ready(function(){
    // Procura os dados recebidos
    if(banco) {
        let id = window.location.search.split('=')[1];
        let cliente = banco[0].clientes[id];

        // Preenche os campos com os dados do cliente
        $('#clientId').val(id);
        $('#clientName').val(cliente.name).trigger('focus');
        $('#clientCPF').val(cliente.cpf).trigger('focus');
        $('#clientCEP').val(cliente.cep).trigger('focus');
        $('#clientLog').val(cliente.logradouro).trigger('focus');
        $('#clientNumero').val(cliente.numero).trigger('focus');
        $('#clientComp').val(cliente.complemento).trigger('focus');
        $('#clientBairro').val(cliente.bairro).trigger('focus');
        $('#clientCidade').val(cliente.cidade).trigger('focus');
        $('#clientEstado').val(cliente.estado).trigger('focus');
        $('#clientPhone').val(cliente.phone).trigger('focus');
        $('#clientEmail').val(cliente.email).trigger('focus');
    }

    $('#edit-client-form').submit(function(event){
        if($('#edit-client-form').is(':valid')) {
            event.preventDefault();

            // formata os dados e insere no banco
            let dados = {
                name: $('#clientName').val(),
                cpf: $('#clientCPF').val(),
                cep: $('#clientCEP').val(),
                logradouro: $('#clientLog').val(),
                numero: $('#clientNumero').val(),
                complemento: $('#clientComp').val(),
                bairro: $('#clientBairro').val(),
                cidade: $('#clientCidade').val(),
                estado: $('#clientEstado').val(),
                phone: $('#clientPhone').val(),
                email: $('#clientEmail').val()
            };
            let id = $('#clientId').val()
            bancoUpdate("clientes", id, dados);
    
            // redireciona o usuário para a tela de estoque
            location = location.href.replace("edit", "index").replace(location.search, '');
        }
    });
});