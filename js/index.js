var Token = 'J4A9Y32GFJT8Y5V5F5SSM1MJZG3KFFIMP4';
    
var blockArray = [];
var globHeight = 0;


// Calculate Block Style
function getBlock (blockHeight) {
    blockHeight = blockHeight.toString(16);

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
        
        addBlock({height: parseInt(blockHeight, 16), gasUsed: gasUsedv,
            gasGrade: gasGradev, totalTrans: totalTransv, size: sizev,
            totalValue: totalValuev});   
    });
}

function addBlock(block) {
    blockArray.push(block);
    console.log(blockArray.length);
    drawBlocks(blockArray);
}

function getBlockList(height){
    for(i=0; i<9; i++){
        height -= 1;
        getBlock(height);
    }
    globHeight = height;
}

function getLatestBlock() {
    // Api etherscan
    fetch('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=' + Token)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        var res = myJson.result;
        var latestBlock = parseInt(res, 16);
        getBlockList(latestBlock);
    });
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

 function drawBlocks(arr) {

    document.getElementById('bottomHalf').innerHTML = '';

    totalVal = 0
    for (i=0; i<arr.length; i++){
       totalVal += arr[i].totalValue;
    }
    for (b=0; b<arr.length; b++){
       var div = document.createElement('div');
       div.className = 'block';
       div.id = 'block' + b;
       div.style.cssText = 'width: ' + ((arr[b].totalValue / totalVal) * 100) + 
       '%; height: ' + (((arr[b].totalValue / totalVal) * 100) * 4) + '%; ' +
       'box-sizing: border-box; border: 1px solid#b1b0b1; border-radius: 15px;' 
       div.innerHTML = b;
       document.getElementById('bottomHalf').appendChild(div);
     }
 }



getLatestBlock();
console.log(blockArray.length);