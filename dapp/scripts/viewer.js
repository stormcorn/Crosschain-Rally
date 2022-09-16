const serverApiKey = 'oKR8OTm6PQKF7fFO1eBxoA3ZwLNRtwt2Pvvmk1cxJ7mAewalEiMBqMRdQEfdqWyP'; // Moralis API key

const rallyCA = '0xE3CED1e769bB4BD79e63c8A00E3cCd4DB952a95d'; // Contract address
const baseUri = 'https://objectstorage.us-ashburn-1.oraclecloud.com/n/idq81xwyo207/b/CrossChainRally/o/'; // Storage location for images

let networkId = ''; // read from wallet

// --------------------------------------------------------------------

String.prototype.compose = (function () {
    var re = /\{{(.+?)\}}/g;
    return function (o) {
        return this.replace(re, function (_, k) {
            return typeof o[k] != 'undefined' ? o[k] : '';
        });
    }
}());

// --------------------------------------------------------------------

async function processDetailData(response){
    let carid = parseInt(response.image.substring(response.image.lastIndexOf('/')+1).replace(/\.[^/.]+$/, ""));   

    var tpl =  '';
    tpl = '<h3 class="float-left">{{title}}</h3>';
    let tgt = $('#itemtitle'+carid);
    tgt.empty();
    tgt.append(tpl.compose({
        title: response.name
    }));

    tpl = '<h6 class="float-left>{{description}}</h6>';
    tgt = $('#itemdescr'+carid);
    tgt.empty();
    tgt.append(tpl.compose({
        description: response.description
    }));


}

async function processData(response) {
    let gen = "";
    var rowtpl =
        '<div class="col mb-4" id="itemidx{{id}}">'+
        '   <div id="itemimg{{id}}" class="border border-dark shadow rounded" style="background-color: rgba(0,0,0,80);">' +         
        '       <img src="{{imgsrc}}.jpg" data-src="{{imgsrc}}.jpg" class="img-fluid rounded-xs" alt="img">' +
        '       <div id="itemtitle{{id}}"></div>' +
        '       <div id="itemdescr{{id}}"></div>' +    
        '       <div>Owned: {{amount}}</div>' + 
        '   </div>'     +
        '</div>';
 
    let tgt = $('#carlist');
    tgt.empty();

    for (i = 0; i < response.result.length; i++) {
        tgt.append(rowtpl.compose({
            'index': i,
            'id': response.result[i].token_id,
            'amount': response.result[i].amount,
            'imgsrc': baseUri + response.result[i].token_id
        }));
        
        const options = { method: 'GET', headers: { Accept: 'application/json' } };
        let uri = baseUri + response.result[i].token_id + '.json';
        fetch(uri, options)
            .then(async response => processDetailData(await response.json()))
            .catch(err => console.error(err));
    }
}

function refreshCarList() {
    networkId = '';    
    switch (ethereum.networkVersion) {
        case '25': networkId='cronos'; break;
        case '56': networkId='bsc'; break;
        case '250': networkId='fantom'; break;
    }
    console.log('Network: '+networkId);
    console.log('Wallet:  '+currentAddr);

    const options = { method: 'GET', headers: { Accept: 'application/json', 'X-API-Key': serverApiKey } };
    fetch('https://deep-index.moralis.io/api/v2/' + currentAddr + '/nft?chain=' + networkId + '&format=decimal&token_addresses=' + rallyCA, options)
        .then(async response => processData(await response.json()))
        .catch(err => console.error(err));
}
