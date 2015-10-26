var monUrl, tab;

function init(){
    chrome.tabs.query({currentWindow: true, active: true},function(tabs){
       monUrl = tabs[0].url;
       tab = tabs[0];

       //Now that we have the data we can proceed and do something with it
       processTab();
    });
}

function processTab(){

    var apiAddress = 'http://raphael.shortner.emulgator.interne/app_dev.php/api/v1/shorters/urls.json';

    var result;

    var request = new XMLHttpRequest();
    request.open('POST', apiAddress);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.responseType = 'json';

    request.onload = function() {
      var rep = request.response;
      result = rep.short;
      document.getElementById('status').innerHTML  = 'Here your awesome shortened URL';
      var urlResult = document.getElementById('url-result');
      urlResult.value = result;
      urlResult.focus();
      urlResult.select();
    };
    request.onerror = function(e) {
      errorCallback(e.target);
    };

    request.send("url=" + monUrl);

    var urlResult = document.getElementById('url-result');
    urlResult.hidden = false;

}

document.addEventListener('DOMContentLoaded', function() {
  init();

  try{
    document.queryCommandEnabled("copy");
    var exec = true;
  } catch(err) {
    var exec = false;
  }
  if (exec) {
    var copyEmailBtn = document.querySelector('.copy');  
    copyEmailBtn.addEventListener('click', function(event) {  
      // Select the email link anchor text  
      var textToPaste = document.querySelector('#url-result');  
      // console.log(textToPaste);
      var range = document.createRange();  
      range.selectNode(textToPaste);  
      window.getSelection().addRange(range);  

      try {  
          // Now that we've selected the anchor text, execute the copy command  
          var successful = document.execCommand('copy');  
          var msg = successful ? 'successful' : 'unsuccessful';  
          // console.log('Copy texte command was ' + msg);
          $('.copy').html('copied');
      } catch(err) {
          console.log('Oops, unable to copy');  
      }  

      // Remove the selections - NOTE: Should use   
      // removeRange(range) when it is supported  
      window.getSelection().removeAllRanges();  
    });
  } else {

    function copyToClipboard(text) {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
    }

    $('#url-result').select();

    // Use JQuery
    $('.copy').click(function() {
        copyToClipboard($('#url-result').val());
    });
  }
});