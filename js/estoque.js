var banco = getBanco();

/**************
    create.html
***************/
$(document).ready(function() {
    // Máscara
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
    // Fim máscara

    $('#add-product-form').submit(function(event){
        if($('#add-product-form').is(':valid')) {
            event.preventDefault();

            let codigo;
            let estoque = banco[0].produtos;
            let unique = false;
            while(!unique) {
                codigo = gerarCodigo();
                let hasEqual = false;

                estoque.forEach(function(item) {
                    if(item.cod == codigo)
                        hasEqual = true;
                });

                if(!hasEqual)
                    unique = true;
            }

            let dados = {
                cod  : codigo,
                desc : $('#productDesc').val(),
                qnt  : $('#productQnt').val(),
                val  : parseFloat($('#productVal').val().slice(3).replace('.','').replace(',','.'))
            };
            bancoInsert("produtos", dados);
    
            location = location.href.replace("create", "index");
        }
    });
});

/**************
    index.html
***************/
$(document).ready(function(){
    if(banco) {
        let produtos = banco[0].produtos;
        let tabelaProdutos = $('#tabelaProdutos tbody');

        tabelaProdutos.text('');
        produtos.forEach(function(item, index){
            tabelaProdutos.append("<tr><th scope='row'>"+item.cod+"</th><td>"+item.desc+"</td><td>"+item.qnt+"</td><td>R$ "+item.val+"</td><td><i onclick='deletarProduto("+index+")' class='material-icons color-red'>delete</i><i onclick='editarProduto("+index+")' class='material-icons color-blue'>border_color</i></td></tr>");
        });
    }
});

function deletarProduto(id) {
    swal({
        title: "Você tem certeza?",
        text: "Não será possível recuperar o dado apagado!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            bancoDelete('produtos', id);

            location.reload();
        }
    });
}

function editarProduto(id) {
    location = location.href.replace("index", "edit") + "?produto=" + id;
}

/**************
    edit.html
***************/
$(document).ready(function(){
    // Procura os dados recebidos
    if(banco) {
        let id = window.location.search.split('=')[1];
        let produto = banco[0].produtos[id];

        // Preenche os campos com os dados do produto
        $('#productId').val(id);
        $('#productCod').val(produto.cod);
        $('#productDesc').val(produto.desc).trigger('focus');
        $('#productQnt').val(produto.qnt).trigger('focus');
        $('#productVal').trigger('focus').val(produto.val * 100).trigger('keyup');
    }

    $('#edit-product-form').submit(function(event){
        if($('#edit-product-form').is(':valid')) {
            event.preventDefault();

            let dados = {
                cod  : $('#productCod').val(),
                desc : $('#productDesc').val(),
                qnt  : $('#productQnt').val(),
                val  : parseFloat($('#productVal').val().slice(3).replace('.','').replace(',','.'))
            };
            let id = $('#productId').val();

            bancoUpdate("produtos", id, dados);
    
            location = location.href.replace("edit", "index").replace(location.search, '');
        }
    });
});