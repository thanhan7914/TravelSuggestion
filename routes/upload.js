const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const _ = require('lodash');
const util = require('../util');
const File = require('../model/file');

exports.filter = function(req, res) {
    //copy url query to params
    util.inherit(req.query, req.params);
    //check
    if(_.isUndefined(req.params.file_name))
        return res.handle_error(new Error("missing parameter"));

    var l = _.toNumber(req.params.l);
    var s = _.toNumber(req.params.p);
    s = Math.max(0, s);
    s *= l;

    if(_.isNaN(l)) l = 10;
    if(_.isNaN(s)) s = 0;

    File.find({file_name:  new RegExp(util.cvv2regexp(req.params.file_name), 'i')})
    .limit(l)
    .skip(s)
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.get_list = function(req, res) {
    //copy url query to params
    util.inherit(req.query, req.params);
    //check
    var l = _.toNumber(req.params.l);
    var s = _.toNumber(req.params.p);
    s = Math.max(0, s);
    s *= l;

    if(_.isNaN(l)) l = 10;
    if(_.isNaN(s)) s = 0;

    File.find({})
    .limit(l)
    .skip(s)
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.remove_file = function(req, res) {
    if(_.isUndefined(req.body.file_id))
        return res.handle_error(new Error("missing parameter"));
    if(!req.isValidObjectId(req.body.file_id))
        return res.handle_error(new Error('invalid file id'));
    
    File.remove({_id: req.body.file_id})
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.upload = function(req, res){
    var rel_path, file_name;

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        rel_path = path.join('../assets/uploads', Date.now() + '_' + files.filetoupload.name);
        rel_path = path.join('tlsg.tk/uploads/', rel_path).replace(/\\/gi, '/');
        rel_path = "//" + rel_path;
        var newpath = path.join(__dirname, rel_path);
        file_name = files.filetoupload.name;

        fs.readFile(oldpath, function(err, data) {
            fs.writeFile(newpath, data, function(err) {
                fs.unlink(oldpath, function(err) {
                    if (err) {
                        res.status(500);
                        res.handle_error(err);
                    } else {
                        var photo = {
                            file_name,
                            rel_path,
                            up_time: Date.now()
                        };

                        return File.create(photo)
                        .then(res.array_dump)
                        .catch(res.handle_error);
                    }
                });
            });
        });
    });
};
