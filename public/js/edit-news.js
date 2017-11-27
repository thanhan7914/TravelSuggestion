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

    let news_id = $('#news_id').val();
    // console.log(news_id);
    $.get('http://tlsg.tk/api/news/' + news_id, function (data, status) {
        // console.log(data.news);
        $('#title').val(data.news[0].title);
        $("div #category option[value=" + data.news[0]._id + "]")
            .prop("selected", true);
        $("div #province option[value=" + data.news[0].province._id + "]")
            .prop("selected", true);
        $('#summernote').summernote('code', data.news[0].content);
        $('#tag').val(data.news[0].tag);
        $('#thumbnail').val(data.news[0].thumbnail);
    });

    $('#bt_submit').click(function () {
       
        let a = $('#title').val();
        let b = $('#category').val();
        let c = $('#province').val();
        let d = postForm();
        let e = $('#tag').val();
        let f = $('#thumbnail').val();
        let g = new Date();
        let k = $('#news_id').val();

        $.post('http://tlsg.tk/api/news/update', {
            title: a,
            category_id: b,
            province_id: c,
            content: d,
            tag: e,
            thumbnail: f,
            date: g,
            token: '6ba2b9df31680dcda5a4a083',
            news_id: k
        }, function (data, message) {
            if (data.status == 200) {
                $('#modalConfirm').modal('show');
                $('#modalConfirm').on('click', '#btnOk', function () {
                    window.location.replace('http://tlsg.tk/admin/list-news');
                });

            } else {
                $('#modalError').modal('show');
                $('#modalError').on('click', '#btOk', function () {
                });
            }
        });
    });
     
});