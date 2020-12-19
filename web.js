window.dataking = {
    send: function (type, event, data) {
        window.dataking.post('/', {type:type, event:event, data});
    },

    post: function (url, data, success) {

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
        return xhr;
    },

    test: function () {
        console.log('test');
    }
}