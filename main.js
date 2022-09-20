var urlBase = "http://localhost/api/v1";

jQuery(document).ready(function () {
    listar();
});

function buscar() {
    var filtro = document.getElementById("filtro").value;
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: urlBase + "/user/",
        data: { "filtro": filtro },
        success: function (response) {
            $("#table-usuarios tr").remove();
            response.map(el => 
                $("#table-usuarios").append(
                    "<tr>" +
                    "<td style=\"text-align:center;\">" + el.matricula + "</td>" +
                    "<td>" + el.name + "</td>" +
                    "<td style=\"text-align:center;\">" + dateFormat(el.birthday) + "</td>" +
                    "<td>" + el.email + "</td>" +
                    "<td style=\"text-align:center;\">" +
                    "<button type=\"button\" class=\"btn badge text-bg-light\" onclick=\"edit('" + el.id + "')\"><span class=\"bx bx-edit\"></span></button>" +
                    "<button type=\"button\" class=\"btn badge text-bg-light\" onclick=\"destroy('" + el.id + "')\"><span class=\"bx bx-trash\"></span></button>" +
                    "</td>" +
                    "</tr>"
                )
            );    
        }, error: function () {
            swal("Index", 'Não foi possivel listar os usuários cadastrados.', "error");
        }
    }).fail(function (resposta) {
        if (resposta.status == 401) {
            swal("Index", "Sem permissão para acessar essa funcionalidade.", "error");
        }
    });
}

function listar() {
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: urlBase + "/user/",
        data: {},
        success: function (response) {
            $("#table-usuarios tr").remove();
            response.map(el => 
                $("#table-usuarios").append(
                    "<tr>" +
                    "<td style=\"text-align:center;\">" + el.matricula + "</td>" +
                    "<td>" + el.name + "</td>" +
                    "<td style=\"text-align:center;\">" + dateFormat(el.birthday) + "</td>" +
                    "<td>" + el.email + "</td>" +
                    "<td style=\"text-align:center;\">" +
                    "<button type=\"button\" class=\"btn badge text-bg-light\" onclick=\"edit('" + el.id + "')\"><span class=\"bx bx-edit\"></span></button>" +
                    "<button type=\"button\" class=\"btn badge text-bg-light\" onclick=\"destroy('" + el.id + "')\"><span class=\"bx bx-trash\"></span></button>" +
                    "</td>" +
                    "</tr>"
                )
            );  
        }, error: function () {
            swal("Index", 'Não foi possivel listar os usuários cadastrados.', "error");
        }
    }).fail(function (resposta) {
        if (resposta.status == 401) {
            swal("Index", "Sem permissão para acessar essa funcionalidade.", "error");
        }
    });
}

function adicionar() {
    $("#titulo").text('Cadastrar Usuário');
    $("#myModal").modal("show");
    var element = document.getElementById("salvar");
    element.onclick = function (event) {
        salvar();
    }
}


function salvar() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: urlBase + "/user/store",
        data: $("#form-avancado").serialize(),
        success: function (data) {
            if (data.success === true) {
                $("#myModal").modal('toggle');
                setTimeout(function () {
                    swal({
                        text: response.msg,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then((result) => {
                        listar();
                    });
                }, 600);
            } else {
                if (data.validate === true) {
                    var erros = data.msg;
                    var keys = Object.keys(erros);
                    validateErrors(erros, keys, 'danger');
                }
                else {
                    setTimeout(function () {
                        swal({
                            text: data.msg,
                            icon: "warning",
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }, 600);
                }
            }
        }, error: function () {
            swal("Store", 'Não foi possivel listar os usuários cadastrados.', "error");
        }
    }).fail(function (resposta) {
        if (resposta.status == 400) {
            swal("Store", "Sem permissão para acessar essa funcionalidade.", "error");
        }
    });
}

function update(id) {
    $.ajax({
        type: "PUT",
        dataType: "json",
        url: urlBase + "/user/update/" + id,
        data: $("#form-avancado").serialize(),
        success: function (data) {
            if (data.success === true) {
                $("#myModal").modal('toggle');
                setTimeout(function () {
                    swal({
                        text: response.msg,
                        icon: "success",
                        timer: 2000
                    }).then((result) => {
                        listar();
                    });
                }, 600);
            } else {
                if (data.validate === true) {
                    var erros = data.msg;
                    var keys = Object.keys(erros);
                    validateErrors(erros, keys, 'danger');
                }
                else {
                    setTimeout(function () {
                        swal({
                            text: data.msg,
                            icon: "warning",
                            timer: 2000
                        });
                    }, 600);
                }
            }
        }, error: function () {
            swal("Update", 'Não foi possivel listar os usuários cadastrados.', "error");
        }
    }).fail(function (resposta) {
        if (resposta.status == 400) {
            swal("Update", "Sem permissão para acessar essa funcionalidade.", "error");
        }
    });
}

function edit(id) {
    $.get(urlBase + "/user/show/" + id, function (response) {

        $("#titulo").text('Editar Usuário');
        $("#name").val(response.name);
        $("#birthday").val(response.birthday);
        $("#email").val(response.email);
        $("#id").val(response.id);
        $("#myModal").modal("show");
        var element = document.getElementById("salvar");
        element.onclick = function (event) {
            update(response.id);
        }
    }).fail(function (resposta) {
        if (resposta.status == 401) {
            swal("Show", "Sem permissão para acessar essa funcionalidade.", "error");
        }
    });
}

function destroy(id) {

    swal({
        title: 'Excluir Usuário',
        text: 'Deseja excluir esse Usuário?',
        icon: "warning",
        buttons: {
            cancel: "Não",
            Sim: true,
        }
    }).then(function (value) {
        if (value) {
            $.ajax({
                type: "DELETE",
                dataType: "json",
                url: urlBase + "/user/delete/" + id,
                success: function (response) {
                    if (response.success === true) {
                        setTimeout(function () {
                            swal({
                                text: response.msg,
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false
                            }).then((result) => {
                                listar();
                            });
                        }, 600);
                    } else {
                        if (response.validate === true) {
                            var erros = response.msg;
                            var keys = Object.keys(erros);
                            validateErrors(erros, keys, 'danger');
                        }
                        else {
                            setTimeout(function () {
                                swal({
                                    text: data.msg,
                                    icon: "warning",
                                    timer: 2000,
                                    showConfirmButton: false
                                });
                            }, 600);
                        }
                    }
                }, error: function () {
                    swal("Delete", 'Não foi possivel listar os usuários cadastrados.', "error");
                }
            }).fail(function (resposta) {
                if (resposta.status == 401) {
                    swal("Delete", "Sem permissão para acessar essa funcionalidade.", "error");
                }
            });
        }
    });

}

function dateFormat(date) {

    const [year, month, day] = date.split('-');

    const result = [day, month, year].join('/');

    return result;
}


function validateErrors(erros, key, type) {
    var color = null;
    console.log(erros, key, type)
    key.forEach(function (index) {
        console.log(erros[index]);
        if (type == 'warning') {
            color = '#db8b0b';
        }

        if (type == 'danger') {
            color = '#d33724';
        }

        if (type == 'orange') {
            color = '#ff7701 ';
        }

        // Não adiciona marcação se o campo for disabled ou readonly
        if($("form input[name=" + index + "]:disabled, form input[name=" + index + "][readonly]").length > 0){
            return;
        }
        if($("form textarea[name=" + index + "]:disabled, form textarea[name=" + index + "][readonly]").length > 0){
            return;
        }


        $("form input[name=" + index + "]").css({
            "border": "solid 1px " + color + "",
            "color": "" + color + ""
        });

        $("form textarea[name=" + index + "]").css({
            "border": "solid 1px " + color + "",
            "color": "" + color + ""
        });

        $("form select[name=" + index + "]").css({
            "border": "solid 1px " + color + " ",
            "color": "" + color + ""
        });

        $("form select[name=" + index + "]").parent().find('.select2-selection').css({
            "border": "solid 1px " + color + " ",
            "color": "" + color + ""
        });

        if ($("form input[name=" + index + "]").length > 0){

            $("form input[name=" + index + "]").attr('data-toggle', "tooltip");
            $("form input[name=" + index + "]").attr('data-placement', "bottom");
            $("form input[name=" + index + "]").attr('title', erros[index]);
            $("form input[name=" + index + "]").unbind("focusin");

        }
        if ($("form select[name=" + index + "]")){

            $("form select[name=" + index + "]").attr('data-toggle', "tooltip");
            $("form select[name=" + index + "]").attr('data-placement', "bottom");
            $("form select[name=" + index + "]").attr('data-original-title', erros[index]);
            $("form select[name=" + index + "]").unbind("focusin");
        }

        if ($("form textarea[name=" + index + "]").length > 0) {

            $("form textarea[name=" + index + "]").attr('data-toggle', "tooltip");
            $("form textarea[name=" + index + "]").attr('data-placement', "bottom");
            $("form textarea[name=" + index + "]").attr('data-original-title', erros[index]);
            $("form textarea[name=" + index + "]").unbind("focusin");

        }

        $("form input[name=" + index + "]").focusin(function () {
            $(this).removeAttr("style");
            $(this).removeAttr("data-original-title");
            $(this).tooltip('destroy');
            $(this).unbind("focusin");
        });

        $("form textarea[name=" + index + "]").focusin(function () {

            $(this).removeAttr("style");
            $(this).removeAttr("data-original-title");
            $(this).tooltip('destroy');
            $(this).unbind("focusin");

        });

        $("form .checkboxFiveInput label").click(function(){
            $(this).parent().parent().parent().find("input[type=text]").focus();
        });

        $("form select[name=" + index + "]").focusin(function () {
            $(this).removeAttr("style");
            $(this).removeAttr("data-original-title");
            $(this).tooltip('destroy');
            $(this).unbind("focusin");
        });

        $("form select[name=" + index + "]").parent().find('.select2-selection').focusin(function () {
            $(this).removeAttr("style");
            $(this).parent().parent().parent().parent().find("label[for=" + index + "]").removeAttr("style");
            $(this).removeAttr("data-original-title");
            $(this).tooltip('destroy');
            $(this).unbind("focusin");
        });
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

}