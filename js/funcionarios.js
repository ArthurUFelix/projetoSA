var banco = getBanco();

/**************
    create.html
***************/
$(document).ready(function() {
    $('#add-func-form').submit(function(event){
        if($('#add-func-form').is(':valid')) {
            event.preventDefault();

            // formata os dados e insere no banco
            let dados = {
                name: $('#funcName').val(),
                cod: $('#funcCod').val(),
                adDate: $('#funcAdDate').val(),
                cargo: $('#funcCargo').val(),
                admin: false
            };

            if(dados.cargo == "Gerente") dados.admin = true;

            bancoInsert("funcionarios", dados);
    
            // redireciona o usuário para a tela de estoque
            window.location = window.location.href.replace("create", "index");
        }
    });
});

/**************
    index.html
***************/
$(document).ready(function(){
    if(banco) {
        let funcionarios = banco[0].funcionarios;
        let tabelaFuncionarios = $('#tabelaFuncionarios tbody');

        tabelaFuncionarios.text('');
        funcionarios.forEach(function(item, index){
            tabelaFuncionarios.append("<tr><th scope='row'>"+item.cod+"</th><td>"+item.name+"</td><td>"+item.adDate+"</td><td>"+item.cargo+"</td><td><i onclick='deletarFunc("+index+")' class='material-icons color-red'>delete</i><i onclick='editarFunc("+index+")' class='material-icons color-blue'>border_color</i></td></tr>");
        });
    }
});

function deletarFunc(id) {
    swal({
        title: "Você tem certeza?",
        text: "Não será possível recuperar o dado apagado!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            bancoDelete('funcionarios', id);

            window.location.reload();
        }
    });
}

function editarFunc(id) {
    window.location = window.location.href.replace("index", "edit") + "?func=" + id;
}

/**************
    edit.html
***************/
$(document).ready(function(){
    // Procura os dados recebidos
    if(banco) {
        let id = window.location.search.split('=')[1];
        let funcionario = banco[0].funcionarios[id];

        // Preenche os campos com os dados do funcionario
        $('#funcId').val(id);
        $('#funcCod').val(funcionario.cod).trigger('focus');
        $('#funcAdDate').val(funcionario.adDate).trigger('focus');
        $('#funcCargo').val(funcionario.cargo).trigger('focus');
        $('#funcName').val(funcionario.name).trigger('focus');
    }

    $('#edit-func-form').submit(function(event){
        if($('#edit-func-form').is(':valid')) {
            event.preventDefault();

            // formata os dados e insere no banco
            let dados = {
                name: $('#funcName').val(),
                cod: $('#funcCod').val(),
                adDate: $('#funcAdDate').val(),
                cargo: $('#funcCargo').val()
            };
            let id = $('#funcId').val()
            bancoUpdate("funcionarios", id, dados);
    
            // redireciona o usuário para a tela de estoque
            window.location = window.location.href.replace("edit", "index");
        }
    });
});