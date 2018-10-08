var Token = 'J4A9Y32GFJT8Y5V5F5SSM1MJZG3KFFIMP4';

// Global block array.
var blockArray = [];


// Fetch latest block.
function getLatestBlock() {
	// Api etherscan, latest block.
	fetch('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=' + Token)
		.then(function (response) {
			return response.json();
		})
		.then(function (myJson) {
			var res = myJson.result;
			var latestBlock = parseInt(res, 16);
			getBlockList(latestBlock);
		})
		.catch((error) => {
			console.log(error)
		});
}

// Grab latest block up until the 9th.
function getBlockList(height) {
	for (i = 0; i < 7; i++) {
		getBlock(height);
		height -= 1;
	}
}

// Fetch block information.
function getBlock(blockHeight) {
	var blockHeight = blockHeight.toString(16);
	// Api etherscan, fetch block info.
	fetch('https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=' + blockHeight + '&boolean=true&apikey=' + Token)
		.then(function (response) {
			return response.json();
		})
		.then(function (myJson) {
			var res = myJson.result;
			var totalValuev = 0;
			for (var i = 0; i < res.transactions.length; i++) {
				totalValuev += parseInt(res.transactions[i].value, 16);
			}
			// Add block attributes to block array.
			addBlock({
				height: parseInt(blockHeight, 16),
				gasUsed: parseInt(res.gasUsed, 16),
				gasGrade: (parseInt(res.gasUsed, 16) / parseInt(res.gasLimit, 16)),
				totalTrans: res.transactions.length,
				size: parseInt(res.size, 16),
				totalValue: totalValuev
			});
		})
		.catch((error) => {
			console.log(error)
		});
}

// Push block into block array.
function addBlock(block) {
	blockArray.push(block);
	drawBlocks(blockArray);
}

// Draw block visulization. 
function drawBlocks(arr) {
	// Clear html since the number of block given by api is variable. 
	document.getElementById('bottomHalf').innerHTML = '';
	// Get total value transfered of all blocks.
	totalVal = 0
	for (i = 0; i < arr.length; i++) {
		totalVal += arr[i].totalValue;
	}
	// Draw each block, size is based on value transfered. Color is based on gas used.
	for (b = 0; b < arr.length; b++) {
		var height = (((arr[b].totalValue / totalVal) * 100) * 3.4);
		if (height > 100) {
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
		// If block is big enough, draw block information on it.
		if (((arr[b].totalValue / totalVal) * 100 > 8)) {
			div.innerHTML = "<div><b>#" + arr[b].height + "</b></div>" +
				"<div>" + Math.round((arr[b].totalValue / 1000000000000000000)) + " eth </div>" +
				"<div>" + arr[b].totalTrans + " transactions </div>" +
				"<div>" + Math.round((arr[b].gasGrade * 100)) + "% gas limit</div>";
		}
		document.getElementById('bottomHalf').appendChild(div);
		// Draw first block to top.
		if (b === 0) {
			var topblock = document.getElementById('topBlock');
			topblock.innerHTML = '';
			topblock.style.cssText = '';
			topblock.style.cssText = 'width: 10%; height: 80%; ' +
				'background-color: rgb(' + red + ', ' + green + ', 0);';
			topblock.innerHTML = "<div><b>#" + arr[b].height + "</b></div>" +
				"<div>" + Math.round((arr[b].totalValue / 1000000000000000000)) + " eth </div>" +
				"<div>" + arr[b].totalTrans + " transactions </div>" +
				"<div>" + Math.round((arr[b].gasGrade * 100)) + "% gas limit</div>";
		}
	}
}

function drawNetStats() {
	// Api etherscan, fetch block info.
	fetch('https://api.etherscan.io/api?module=stats&action=ethsupply')
		.then(function (response) {
			return response.json();
		})
		.then(function (myJson) {
			var res = myJson.result;
			var supply = document.getElementById('supply');
			supply.innerHTML = res / 1000000000000000000;
			drawPrice((res / 1000000000000000000));
		})
		.catch((error) => {
			console.log(error)
		});
}

function drawPrice(supply) {
	// Api etherscan, fetch market info.
	fetch('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=' + Token)
		.then(function (response) {
			return response.json();
		})
		.then(function (myJson) {
			var res = myJson.result;
			var price = document.getElementById('price');
			price.innerHTML = '$' + res.ethusd + ' USD';
			drawMC(supply, res.ethusd);
		})
		.catch((error) => {
			console.log(error)
		});
}

function drawMC(supply, price) {
	// Calculate and draw market cap.
	var marketCap = document.getElementById('marketCap');
	marketCap.innerHTML = '$' + Math.round((supply * price));
}

// Get and draw blocks.
getLatestBlock();
drawNetStats();

// Reload page.
setTimeout(function () {
	location.reload();
}, 20000);