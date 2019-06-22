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
                var exists = false;
                produtosVenda.forEach(function(itemVenda, indexVenda) {
                    if(itemVenda.cod == item.cod) {
                        exists = true;
                    }
                });
                // Se não existir, mostre
                if(exists == false) {
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
                if(item.cpf == client) {
                    hasClient = true;
                    clienteVenda = Object.assign({}, item);
                    
                    // Se a busca do campo der match com algum cliente adicione ele aos cards
                    $('#showClient').append('<div class="card col-3"><div class="card-body"><h5 class="card-title">'+item.name+'</h5><p class="card-text">CPF: '+item.cpf+'</p><p>'+item.bairro+'. '+ item.cidade+', '+item.estado+'.</p></div></div>');
                }
            });
        }
        
        if(hasClient == false) {
            clienteVenda = null;
            $('#showClient').text('Nenhum cliente encontrado');
        }
    });
});

// Adiciona os produtos a tabela de vendas
function addProduct(productIndex) {
    let products = banco[0].produtos;

    products.forEach(function(item, index) {
        if(index == productIndex) {
            novoProduto = Object.assign({}, item);
            produtosVenda.push(novoProduto);
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
        tabela.append("<tr><th scope='row'>"+item.cod+"</th><td>"+item.desc+"</td><td class='estoqueQnt'>"+item.qnt+"</td><td><input type='number' placeholder='Digite a quantidade' class='form-control productQnt' value='"+(item.qntVenda?item.qntVenda:'')+"' data-index='"+index+"'></td><td class='item-price' data-price='"+item.val+"'>R$ "+item.val+"</td><td><i onclick='deleteProduct("+index+")' class='material-icons color-red'>delete</i></td></tr>");
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

        // console.log(itemQnt, estoqueQnt);
        if(Number(itemQnt) > Number(estoqueQnt) || itemQnt == "") {
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

$(document).ready(function() {
    // Função para concluir venda
    $('#add-vendas-form').submit(function(e) {
        e.preventDefault();

        // Se nenhum campo tive erro
        if(formIsValid()) {
            let loja = banco[0].loja[0];
            let authUser = JSON.parse(sessionStorage.auth);

            // formata os dados e insere no banco
            let dados = {
                loja                 : loja.nome,
                dataFormatada        : new Date().toLocaleDateString(),
                data                 : new Date().getTime(),
                horario              : new Date().toLocaleTimeString(),
                cliente              : clienteVenda,
                produtos             : produtosVenda,
                funcionario          : {nome: authUser.userData.name, id: authUser.userData.cod},
                total               : $('#showTotalPrice').text()
            };

            // Nesse ponto os dados ja foram montados corretamente e passou em todas validações, agora subtrai do estoque
            let produtos = banco[0].produtos;
            produtos.forEach(function(itemMain, indexMain) {
                dados.produtos.forEach(function(item, index) {
                    if(itemMain.cod == item.cod) {
                        let novaQnt = itemMain.qnt - item.qntVenda;
                        itemMain.qnt = novaQnt;
                        bancoUpdate('produtos', indexMain, itemMain);
                    }
                });
            });

            // Após atualizar o estoque, salva a venda
            bancoInsert('vendas', dados);

            // Redireciona o usuário para os relatórios
            var rootPath = location.href.split("pages");
            if(authUser.admin)
                var newPath = rootPath[0] + "pages/relatorios/index.html";
            else
                var newPath = rootPath[0] + "pages/loja/index.html";
            window.open(newPath, "_self");
        } else {
            swal("Falha ao finalizar venda!", "Alguns dados informados estão incorretos, verifique-os e tente novamente", "error");
        }
    });

    function formIsValid() {
        let hasError = false;

        if(produtosVenda.length == 0)
            hasError = true;
        else if(clienteVenda == null)
            hasError = true;
        else if($('#add-vendas-form').find('input').hasClass('is-invalid'))
            hasError = true;

        calculateTotalPrice();
        if($('#showTotalPrice').text() == "")
            hasError = true;

        if(hasError)
            return false;
        else
            return true;
    }
});
