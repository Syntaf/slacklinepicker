var parseHook = function(hook) {
    var productList = [];
    hook.split('-').forEach(function(x){
        var params = x.split('&');
        if(params.length == 2) {
            productList.push({
                id: parseInt(params[0],10),
                amount: parseInt(params[1],10)
            });
        } else if (params.length == 1) {
            productList.push({
                id: parseInt(params[0],10),
                amount: 1
            });
        } else {
            return 'ERROR'
        }
    });

    return productList;
}
