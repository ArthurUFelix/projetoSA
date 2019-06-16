var banco = getBanco();

/**************
    create.html
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

        let cep = $(this).val();

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
            tabelaClientes.append("<tr><th scope='row'>"+item.name+"</th><td>"+item.address+"</td><td>"+item.phone+"</td><td>"+item.email+"</td><td><i onclick='deletarCliente("+index+")' class='material-icons color-red'>delete</i><i onclick='editarCliente("+index+")' class='material-icons color-blue'>border_color</i></td></tr>");
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
        $('#clientName').trigger('focus').val(cliente.name);
        $('#clientCPF').trigger('focus').val(cliente.cpf);
        $('#clientCEP').trigger('focus').val(cliente.cep);
        $('#clientLog').trigger('focus').val(cliente.logradouro);
        $('#clientNumero').trigger('focus').val(cliente.numero);
        $('#clientComp').trigger('focus').val(cliente.complemento);
        $('#clientBairro').trigger('focus').val(cliente.bairro);
        $('#clientCidade').trigger('focus').val(cliente.cidade);
        $('#clientEstado').trigger('focus').val(cliente.estado);
        $('#clientPhone').trigger('focus').val(cliente.phone);
        $('#clientEmail').trigger('focus').val(cliente.email);
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