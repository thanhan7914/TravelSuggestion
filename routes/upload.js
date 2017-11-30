const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const _ = require('lodash');
const File = require('../model/file');

exports.get_list = function(req, res) {
    File.find({})
    .limit(req.param.limit)
    .skip(req.param.skip)
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.upload = function(req, res){
    var rel_path, file_name;

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        rel_path = path.join('../assets/uploads', Date.now() + '_' + files.filetoupload.name);
        var newpath = path.join(__dirname, rel_path);
        file_name = files.filetoupload.name;

        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            console.log('upload Done');
            
            var photo = {
                file_name,
                rel_path,
                up_time: Date.now()
            };
    
            return File.create(photo)
            .then(res.array_dump)
            .catch(res.handle_error);
        });
    });
};
