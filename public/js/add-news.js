$(document).ready(function () {
    $('#summernote').summernote({
        height: 500,
        toolbar: [
            ['style', ['hr', 'bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['color', ['color']],
            ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
            ['height', ['height']],
            ['insert', ['picture', 'link', 'video', 'table']],
            ['misc', ['fullscreen', 'codeview', 'undo', 'redo', 'help']]
        ]
    });

    var postForm = function () {
        var content = $('#summernote').summernote('code');
        return content;
    }

    $.get('http://tlsg.tk/api/province/list', function (data, status) {
        var i = 0;
        $.each(data, function (key, value) {
            $('#province')
                .append($("<option></option>")
                    .attr("value", data[i]._id)
                    .text(data[i].province_name));
            i++;
        });

    });

    $.get('http://tlsg.tk/api/category/list', function (data, status) {
        data.forEach(element => {
            $('#category')
                .append($('<option></option>')
                    .attr('value', element._id)
                    .text(element.category_name));

        });
    });


    $('#bt_submit').click(function () {
        let a = $('#title').val();
        let b = $('#category').val();
        let c = $('#province').val();
        let d = postForm();
        let e = $('#tag').val();
        let f = $('#thumbnail').val();
        let g = new Date();
        console.log('A: ' + a + ' B: ' + b + ' C: ' + c + ' D: ' + d + ' E:' + e + ' F:' + f + ' G:' + g);
        $.post('http://tlsg.tk/api/news/add', {
            title: a,
            category_id: b,
            province_id: c,
            content: d,
            tag: e,
            thumbnail: f,
            date: g,
            token: '6ba2b9df31680dcda5a4a083'
        }, function (data, message) {
            if (data.status == 200) {
                $('#modalConfirm').modal('show');
                $('#modalConfirm').on('click', '#btnOk', function () {
                    window.location.replace('http://tlsg.tk/admin/list-news');
                });

            } else {
                $('#modalError').modal('show');
                $('#modalError').on('click', '#btOk', function () {
                    window.location.replace('http://tlsg.tk/admin/add-news');
                });
            }

        });
    });

});