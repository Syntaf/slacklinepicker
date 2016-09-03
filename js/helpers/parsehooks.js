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

var makeId = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var capitalizeRoutes = function(input)
{
    return input.replace('_', ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
