var banco = getBanco();
var relVenda = [];

// Atualiza a tabela de Relatórios
function updateTabelaRel() {
    let tabela = $('#tabelaVendas tbody');
    tabela.text('');

    relVenda.forEach(function(item, index) {
        tabela.append("<tr><td class='vendaData'>" + venda.data + "</td><td class='vendaLoja'>" + venda.loja + "</td><td class='vendaVendedor'>" + venda.vendedor + "</td><td class='vendaProd'>" + venda.produtos + "</td><td class='vendaClient'>" + venda.client + "</td><td class='vendaTotal'>" + venda.total + "</td><td><i onclick='deletarVenda("+index+")' class='material-icons color-red'>delete</i><i onclick='editarVenda("+index+")' class='material-icons color-blue'>border_color</i></td></tr>");
    });
}

//CRIAR: editarVenda(); deletarVenda();

/* // Deleta os produtos da tabela e do array
function deleteVenda(productIndex) {
    let products = banco[0].produtos;

    products.forEach(function(item, index) {
        if(index == productIndex) {
            produtosVenda.splice(index, 1);
        }
    });

    updateProductsTable(); 
}
 */
