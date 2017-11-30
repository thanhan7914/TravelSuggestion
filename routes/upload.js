const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const _ = require('lodash');
const File = require('../../model/file');

exports.get_list = function(req, res) {
    File.find({})
    .limit(req.param.limit)
    .skip(req.param.skip)
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.upload = function(req, res){
    var rel_path, file_name;
    // create an incoming form object
    var form = new formidable.IncomingForm();
    
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    
    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../public/uploads');
    
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        rel_path = path.join(form.uploadDir, Date.now() + '_' + file.name);
        file_name = file.path;
        console.log(rel_path);
        console.log(file_name);
        fs.rename(file.path, rel_path);
    });
    
    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
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
};
