function showJSScrypt(hash) {
    return "<div>Scrypt Hash from js-scrypt:</div> <div>" + hash + "</div>"
}

function showTruebitScrypt(hash) {
    return "<div>Scrypt Hash from TrueBit solver:</div> <div>" + hash + "</div>"
}

var fileSystem, scryptSubmitter, account

function getTruebitScrypt(data) {

    let hash = "default"
    
    scryptSubmitter.submitData(data, {gas: 200000}, function(error, txHash) {
	if(error) {
	    alert(error)
	} else if(txHash) {
	    
	    let f = window.web3.filter()

	    f.watch(function(error, result) {
		if (error) {
		    alert(error)
		} else if(result) {
		    f.stopWatching()

		    let fileID = result.args.files[0]

		    fileSystem.getData.call(fileID, function (error, result) {
			if(error) {
			    alert(error)
			} else if(result) {
			    hash = result[0]
			}
		    })
		}
	    })
	}
    })

    return hash
}

function runScrypt() {
    data = document.getElementById('input-data').value
    hash = s.crypto_scrypt(data, "foo", 1024, 1, 1, 256)
    document.getElementById('js-scrypt').innerHTML = showJSScrypt(s.to_hex(hash))

    truHash = getTruebitScrypt(data)

    document.getElementById('tb-scrypt').innerHTML = showTruebitScrypt(truHash)
}

function getArtifacts(networkName) {
    httpRequest = new XMLHttpRequest()

    httpRequest.onreadystatechange = function() {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
	    //get scrypt submitter artifact
	    const artifacts = JSON.parse(httpRequest.responseText)

	    fileSystem = window.web3.eth.contract(artifacts.fileSystem.abi).at(artifacts.fileSystem.address)

	    scryptSubmitter = window.web3.eth.contract(artifacts.scrypt.abi).at(artifacts.scrypt.address)

	    account = window.web3.eth.defaultAccount
	}
    }

    httpRequest.open('GET', '/contracts?network=' + networkName)
    httpRequest.send()
}

function init() {
    const isMetaMaskEnabled = function() { return !!window.web3 }

    if (!isMetaMaskEnabled()) {
	document.getElementById('app').innerHTML = "Please install MetaMask"
    } else {

	//alert(networkType)
	window.web3.version.getNetwork((err, netId) => {
	    if(netId == '1') {
		getArtifacts('main')
	    } else if(netId == '3') {
		getArtifacts('ropsten')
	    } else if(netId == '4') {
		getArtifacts('rinkeby')
	    } else if(netId == '42') {
		getArtifacts('kovan')
	    } else {
		getArtifacts('private')
	    }
	})
	
    }
}

window.onload = init
