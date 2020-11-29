"use strict";
var allCurrencies = document.getElementById('all-currencies');
var pastCurrencies = document.getElementById('past-currencies');

function getDataCurrency() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.exchangeratesapi.io/latest?base=PLN', true);

    // xhr.responseType = 'json'

    xhr.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            //Parse JSON file from string to object
            var data = JSON.parse(xhr.response);
            var currencyEntries = Object.entries(data.rates);

            //displaying first column: rate based on PLN
            currencyEntries.forEach(function (item) {
                allCurrencies.innerHTML += '<div class="single">' + '<div id=' + item.slice(0, -1).join(' ') +' class="single-code">' + item.join('</div> <span>:</span> ' + '<div class="single-numbers">') + '</div>'+ '</div>';   
            });
        }
    }
    xhr.send();
}

function getCurrencyCode() {
    setTimeout(function() {
        document.querySelectorAll('.single-code').forEach(function (element) {
            element.addEventListener('click', function (e) {
                //getting current date to add into API endpoint
                var dateObj = new Date();
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var newDate = year + "-" + month + "-" + day;
                
                //getting id to pass into API endpoint as a currency code
                var countryCode = e.target.id;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://api.exchangeratesapi.io/history?start_at=2020-11-16&end_at='+newDate+'&symbols='+countryCode+'', true);

                xhr.onload = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var datas = JSON.parse(xhr.response);
                    var codePln = 'PLN';
                    datas.base = codePln;
                    
                    var currencyEntries = Object.entries(datas.rates);

                    //clearing and sorting currency history
                    pastCurrencies.innerHTML = '';
                    currencyEntries.sort().reverse();

                    //displaying second column: history of certain currency
                    currencyEntries.forEach(function (item) {
                        pastCurrencies.innerHTML += '<div class="single-currency">' + '<div class="date">' + item[0] + '</div>' + ' ' + Object.entries(item[1]);   
                    });
                }
            }
            xhr.send();
        })});
    }, 100);
}

getCurrencyCode();


document.addEventListener('DOMContentLoaded', getDataCurrency);
