var Token = 'J4A9Y32GFJT8Y5V5F5SSM1MJZG3KFFIMP4';
    
var blockArray = [];
// Calculate Block Style
function getBlock (blockHeight) {
    // Api etherscan
    fetch('https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=' + blockHeight + '&boolean=true&apikey=' + Token)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        var res = myJson.result;
        var gasUsedv = parseInt(res.gasUsed, 16);
        var gasLimitv = parseInt(res.gasLimit, 16);
        var gasGradev = gasUsedv / gasLimitv;
        var totalTransv = res.transactions.length;
        var sizev = parseInt(res.size, 16);
        var totalValuev = 0;
        for (var i=0; i<totalTransv; i++) {
            totalValuev += parseInt(res.transactions[i].value, 16);
        }
        
        blockArray.push({height: parseInt(blockHeight, 16), gasUsed: gasUsedv, gasGrade: gasGradev, totalTrans: totalTransv, size: sizev, totalValue: totalValuev});
       
    });
}

var height = 6421999;
getBlock(height.toString(16));
console.log(blockArray.length);