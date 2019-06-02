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

    $('#add-func-form').submit(function(event){
        if($('#add-func-form').is(':valid')) {
            event.preventDefault();

            // formata os dados e insere no banco
            let dados = {
                name: $('#funcName').val(),
                cod: $('#funcCod').val(),
                adDate: $('#funcAdDate').val(),
                cargo: $('#funcCargo').val()
            };
            bancoInsert("funcionarios", dados);
    
            // redireciona o usuário para a tela de estoque
            alert("Dps redirecionar user");
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
            tabelaFuncionarios.append("<tr><th scope='row'>"+item.cod+"</th><td>"+item.name+"</td><td>"+item.adDate+"</td><td>"+item.cargo+"</td><td><i class='material-icons color-red'>delete</i><i class='material-icons color-blue'>border_color</i></td></tr>");
        });
    }
});