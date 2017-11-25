$(document).ready(function () {

    $.get('http://tlsg.tk/api/places/list', function (data, status) {
        let i = 0;
        data.places.forEach(function (el) {
            $('#tableLP').find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                        .attr('id', el._id)
                        .text(i++)
                    )
                    .append($('<td>')
                        .text(el.place_name)
                    )
                    .append($('<td>')
                        .text(el.address)
                    )
                    .append($('<td>')
                        .text(el.phone)
                    )
                    .append($('<td>')
                        .html('<a href="" id="' + el._id + '" style="margin-left:10px;"><span class="glyphicon glyphicon-pencil "></span></a><a style="margin-left:15px;color:red;" href=""  data-toggle="modal" class="btnDelete" id="' + el._id + '"><span class="glyphicon glyphicon-trash"></a>')
                    )
                );

        }, this);
    });

    let txt = '';
    $('#txtSearch').keyup(function () {
        txt = document.getElementById('txtSearch').value;
        $.get('http://tlsg.tk/api/places/filter?name=' + txt, function (data, status) {
            $('#tableLP tbody').empty();
            let i = 0;
            data.places.forEach(function (el) {
                $('#tableLP').find('tbody').append($('<tr>')
                    .append($('<td>')
                        .attr('id', el._id)
                        .text(i)
                    )
                    .append($('<td>')
                        .text(el.place_name)
                    )
                    .append($('<td>')
                        .text(el.address)
                    )
                    .append($('<td>')
                        .text(el.phone)
                    )
                    .append($('<td>')
                        .html('<a href="" id="' + el._id + '"><span class="glyphicon glyphicon-pencil "></span></a><a style="margin-left:10px;color:red;" href="" id="' + el._id + '"><span class="glyphicon glyphicon-trash "></span></a>')
                    )

                )
                i++;
            }, this)
        });

    });

    $('body').on('click', '#tableLP tr td .btnDelete', function () {
        $('#hiddenVal').val($(this).attr('id'));
        $('#myModal').modal('show');
    });

    $('#myModal').on('click', '#btnDeleteYes', function () {
        let id = $('#hiddenVal').val();
        $.post('http://tlsg.tk/api/place/remove', {
            token: '6ba2b9df31680dcda5a4a083',
            place_id: id
        }, function (data, status) {
            if (data.status == 200) {
                $('#modalDeleteSuccess').modal('show');
                $('#modalDeleteSuccess').on('click', '#btnOk', function () {
                    window.location.href = 'http://tlsg.tk/admin/list-place';
                });
            } else {
                $('#modalFail').modal('show');
            }
           
        });
    });

});
