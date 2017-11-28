$(document).ready(function () {
    $.get('http://tlsg.tk/api/news/list?l=40', function (data, status) {
        let i = 0;
        data.news.forEach(function (el) {
            $('#tableLN').find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                        .attr('id', el._id)
                        .text(i++)
                    )
                    .append($('<td>')
                        .text(el.title)
                    )
                    .append($('<td>')
                        .text(el.date)
                    )
                    .append($('<td>')
                        .html('<a style="margin-left:10px;" href="http://tlfg.tk/admin/edit-news/news-id/'+el._id +'"'+' class="btnEdit" id="' + el._id +
                        '"><span class="glyphicon glyphicon-pencil "></span></a><a class="btnDelete" data-toggle="modal" style="margin-left:20px;color:red;" href="" id="' + el._id + '"><span class="glyphicon glyphicon-trash "></span></a>')
                    )
                );
        }, this);
    });

    $('body').on('click', '#tableLN tr td .btnDelete', function () {
        $('#hiddenVal').val($(this).attr('id'));
        $('#modalConfirm').modal('show');
    });

    $('#modalConfirm').on('click', '#btnDeleteYes', function () {
        let id = $('#hiddenVal').val();
        $.post('http://tlsg.tk/api/news/remove', {
            token: '6ba2b9df31680dcda5a4a083',
            news_id: id
        }, function (data, status) {
            if (data.status == 200) {
                $('#modalDeleteSuccess').modal('show');
                $('#modalDeleteSuccess').on('click', '#btnOk', function () {
                    window.location.href = 'http://tlsg.tk/admin/list-news';
                });
            } else {
                $('#modalFail').modal('show');
            }
        });
    });

});