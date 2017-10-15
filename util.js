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
    }
};