var Token = 'J4A9Y32GFJT8Y5V5F5SSM1MJZG3KFFIMP4';
    
var blockArray = [];
var globHeight = 0;


// Calculate Block Style
function getBlock (blockHeight) {
    var blockHeight = blockHeight.toString(16);

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
        var height = (((arr[b].totalValue / totalVal) * 100) * 3.4);
        if (height > 100){
            height = 100;
        }
        var red = Math.round((arr[b].gasGrade * 255));
        var green = 255 - red;
       var div = document.createElement('div');
       div.className = 'block';
       div.id = 'block' + b;
       div.style.cssText = 'width: ' + ((arr[b].totalValue / totalVal) * 100) + 
       '%; height: ' + height + '%; ' +
       'background-color: rgb(' + red + ', ' + green + ', 0);'; 
       if (((arr[b].totalValue / totalVal) * 100 > 8)) {
           div.innerHTML = "<div><b>#" + arr[b].height + "</b></div>" +
           "<div>" + Math.round((arr[b].totalValue / 1000000000000000000)) + " eth </div>" +
           "<div>" + arr[b].totalTrans + " transactions </div>" +
           "<div>" + Math.round((arr[b].gasGrade * 100)) + "% gas limit</div>";
       }
       document.getElementById('bottomHalf').appendChild(div);
       if (b === 0) {
            document.getElementById('topHalf').innerHTML = '';
            var topText = document.createElement('h1');
            topText.innerHTML = "Latest Block:";
            document.getElementById('topHalf').appendChild(topText);
            var topblock = document.createElement('div');
            topblock.className = 'block';
            topblock.id = 'topBlock';
            topblock.style.cssText = 'width: 10%; height: 80%; ' +
            'background-color: rgb(' + red + ', ' + green + ', 0);';
            topblock.innerHTML = "<div><b>#" + arr[b].height + "</b></div>" +
           "<div>" + Math.round((arr[b].totalValue / 1000000000000000000)) + " eth </div>" +
           "<div>" + arr[b].totalTrans + " transactions </div>" +
           "<div>" + Math.round((arr[b].gasGrade * 100)) + "% gas limit</div>";
           document.getElementById('topHalf').appendChild(topblock);
           drawNetStats();

       }
     }
 }

 function drawNetStats() {
    var netStats = document.createElement('div');
    netStats.id = 'netStats';
    document.getElementById('topHalf').appendChild(netStats);
    var left = document.createElement('div');
    left.id = 'left';
    document.getElementById('netStats').appendChild(left);
    var center = document.createElement('div');
    center.id = 'center';
    center.innerHTML = "testforspacing";
    document.getElementById('netStats').appendChild(center);
    var right = document.createElement('div');
    right.id = 'right';
    document.getElementById('netStats').appendChild(right);

    var supplyL = document.createElement('h3');
    supplyL.innerHTML = 'Total Ether Supply';
    document.getElementById('left').appendChild(supplyL);
    var marketCapL = document.createElement('h3');
    marketCapL.innerHTML = 'Market Capitalization';
    document.getElementById('left').appendChild(marketCapL);
    var priceL = document.createElement('h3');
    priceL.innerHTML = 'Ether Price';
    document.getElementById('left').appendChild(priceL);

    var supplyR = document.createElement('h3');
    supplyR.innerHTML = '102,405,253.75';
    document.getElementById('right').appendChild(supplyR);
    var marketCapR = document.createElement('h3');
    marketCapR.innerHTML = '$22,927,512,261';
    document.getElementById('right').appendChild(marketCapR);
    var priceR = document.createElement('h3');
    priceR.innerHTML = '$223.89 USD';
    document.getElementById('right').appendChild(priceR);
 }



getLatestBlock();
console.log(blockArray.length);