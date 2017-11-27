module.exports = {
    token: '6ba2b9df31680dcda5a4a083',
    inherit: function(a, b) {
        for (let i in a)
            if (a.hasOwnProperty(i)) b[i] = a[i];
    },
    override: function(a, b) {
        for (let i in a)
            if (a.hasOwnProperty(i) && !b.hasOwnProperty(i)) b[i] = a[i];
    },
    deepclone: function(a, b, c) {
        if (!(c instanceof Array)) c = [];
        for (let i in a)
            if (a.hasOwnProperty(i) && c.indexOf(i.toString()) === -1) {
                if (a[i] instanceof Array) b[i] = a[i];
                else if (typeof a[i] === 'object') {
                    if (!b.hasOwnProperty(i)) b[i] = {};
                    this.deepclone(a[i], b[i]);
                } else b[i] = a[i];
            }
    },
    clonewith: function(a, b, c) {
        if (!(c instanceof Array)) c = [];
        for (let i in a)
            if (a.hasOwnProperty(i) && c.indexOf(i.toString()) !== -1) b[i] = a[i];
    },
    clonewithout: function(a, b, c) {
        if (!(c instanceof Array)) c = [];
        for (let i in a)
            if (a.hasOwnProperty(i) && c.indexOf(i.toString()) === -1) b[i] = a[i];
    },
    htmlentities: function(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    hasattr: function(obj, attr) {
        if (typeof obj['hasOwnProperty'] === 'undefined') throw '##obj has not attribute hasOwnProperty.';
        if (typeof attr === 'string') return obj.hasOwnProperty(attr);
        if (attr instanceof Array) {
            let un = true;
            for (let i of attr)
                if (!(un = obj.hasOwnProperty(i))) break;

            return un;
        }

        throw 'variable ##attr invalid';
    },
    empty: function(obj, attr) {
        if(typeof attr === 'string')
            return obj.hasOwnProperty(attr) && obj[attr] !== '';
        
        if(attr instanceof Array)
        {
            let un = true;
            for(let i of attr)
                if(!(un = (obj.hasOwnProperty(i) && obj[i] !== '')))
                    break;
            
            return un;
        }

        throw 'variable ##attr invalid';
    },
    _typeof: function(variable) {
        if (variable instanceof Array) return 'array';
        if (variable instanceof Promise) return 'promise';
        return (typeof variable).toString();
    },
    hastype: function(obj, types) {
        let un = true;
        for (let i in types)
            if (!(un = (obj.hasOwnProperty(i) && (this._typeof(obj[i]) === types[i])))) break;

        return un;
    },
    getParameterByName: function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    getHost: function(url) {
        return url.match(/(http(s)?:\/\/)?([a-zA-Z0-9_\-\.])*/)[0];
    },
    isNaN: function(num) {
        return num !== num;
    },
    parse_query_url: function(url) {
        var query;
        var pos = url.indexOf('?');
        if (pos === -1) return {};
        query = url.substring(pos + 1);

        var result = {};

        query.split("&").forEach(function(part) {
            if (!part) return;
            // replace every + with space, regexp-free version
            part = part.split("+").join(" ");
            var eq = part.indexOf("=");
            var key = eq > -1 ? part.substr(0, eq) : part;
            var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
            var from = key.indexOf("[");
            if (from == -1) result[decodeURIComponent(key)] = val;
            else {
                var to = key.indexOf("]", from);
                var index = decodeURIComponent(key.substring(from + 1, to));
                key = decodeURIComponent(key.substring(0, from));
                if (!result[key]) result[key] = [];
                if (!index) result[key].push(val);
                else result[key][index] = val;
            }
        });
        return result;
    },
    cvv2e: function(str) {
        str = String(str);
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        return str.trim();
    },
    cvv2regexp: function(str) {
        str = str.replace('a','(a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)');
        str = str.replace('e', '(e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)');
        str = str.replace('i', '(i|ì|í|ị|ỉ|ĩ)');
        str = str.replace('o', '(o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)');
        str = str.replace('u', '(u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)');
        str = str.replace('y', '(y|ỳ|ý|ỵ|ỷ|ỹ)');
        str = str.replace('d', '(d|đ)');
        return str;
    }
};