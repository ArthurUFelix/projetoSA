var banco = getBanco();

/**************
    index.html
***************/

var produtosVenda = [];
var clienteVenda;

$(document).ready(function() {
    // Carrega informação da loja e do vendedor
    var vendedor = JSON.parse(sessionStorage.auth);
    var loja = banco[0].loja[0];
    $('#loja').val(loja.nome);
    $('#vendedor').val(vendedor.userData.cod);

    // Busca de produtos
    $('#findProducts').click(function() {
        let product = $('#productName').val();
        let hasProducts = false;

        if(product != "") {
            $('#showProducts').text('');

            let produtos = banco[0].produtos;
            produtos.forEach(function(item, index) {
                // Mostra apenas os itens ainda não selecionados
                if(!produtosVenda.includes(item)) {
                    if(item.desc.toUpperCase().match(new RegExp(product.toUpperCase()))) {
                        hasProducts = true;
                        // Se a busca do campo der match com algum produto adicione ele aos cards
                        $('#showProducts').append('<div class="card"><div class="card-body"><h5 class="card-title">'+item.desc+'</h5><p class="card-text">'+item.cod+'</p><a class="btn btn-sm btn-success" onclick="addProduct('+index+')"><i class="material-icons">add</i></a></div></div>');
                    }
                }
            });
        }

        if(hasProducts == false) {
            $('#showProducts').text('Nenhum produto encontrado');
        }
    });

    // Busca de cliente
    $('#findClient').click(function() {
        let client = $('#clientCPF').val();
        let hasClient = false;
        
        if(client != "") {
            $('#showClient').text('');

            let clientes = banco[0].clientes;
            clientes.forEach(function(item, index) {
                if(item.cpf.match(new RegExp(client))) {
                    hasClient = true;
                    clienteVenda = item;

                    // Se a busca do campo der match com algum cliente adicione ele aos cards
                    $('#showClient').append('<div class="card col-3"><div class="card-body"><h5 class="card-title">'+item.name+'</h5><p class="card-text">CPF: '+item.cpf+'</p><p>'+item.bairro+'. '+ item.cidade+', '+item.estado+'.</p></div></div>');
                }
            });
        }

        if(hasClient == false) {
            $('#showClient').text('Nenhum cliente encontrado');
        }
    });
});

// Adiciona os produtos a tabela de vendas
function addProduct(productIndex) {
    let products = banco[0].produtos;

    products.forEach(function(item, index) {
        if(index == productIndex) {
            produtosVenda.push(item);
        }
    });

    updateProductsTable();
}

// Deleta os produtos da tabela e do array
function deleteProduct(productIndex) {
    let products = banco[0].produtos;

    products.forEach(function(item, index) {
        if(index == productIndex) {
            produtosVenda.splice(index, 1);
        }
    });

    updateProductsTable();
}

// Atualiza a tabela com os dados do array
function updateProductsTable() {
    let tabela = $('#tabelaProdutos tbody');
    tabela.text('');

    produtosVenda.forEach(function(item, index) {
        tabela.append("<tr><th scope='row'>"+item.cod+"</th><td>"+item.desc+"</td><td class='estoqueQnt'>"+item.qnt+"</td><td><input type='number' placeholder='Digite a quantidade' class='form-control productQnt' value='"+(item.qntVenda?item.qntVenda:'')+"' data-index='"+index+"'><div class='invalid-tooltip'>Não disponível em estoque.</div></td><td class='item-price' data-price='"+item.val+"'>R$ "+item.val+"</td><td><i onclick='deleteProduct("+index+")' class='material-icons color-red'>delete</i></td></tr>");
    });

    $('.productQnt').keyup(function() {
        calculateTotalPrice();
    });

    calculateTotalPrice();
    $('#findProducts').trigger('click');
}

// Calcula o preço total com base nos dados DA TABELA
function calculateTotalPrice() {
    let totalPrice = 0;

    let linhasTabela = $('#tabelaProdutos tbody tr');
    linhasTabela.each(function(index) {
        
        let itemPrice = $(this).find('td.item-price').attr('data-price');
        let itemQnt = $(this).find('input').val();

        // Valida a quantidade em relação ao estoque
        let estoqueQnt = $(this).find('td.estoqueQnt').text();

        if(itemQnt > estoqueQnt) {
            $(this).find('input').addClass('is-invalid');
        } else {
            $(this).find('input').removeClass('is-invalid');
        }

        // Atualiza no ARRAY a quantidade do produto
        produtosVenda[index].qntVenda = itemQnt;

        totalPrice += itemPrice * itemQnt;
    });

    $('#showTotalPrice').text(totalPrice);
}