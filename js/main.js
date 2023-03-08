// var headerButton = document.querySelector('.header-button');
var header = document.querySelector('.header')

header.addEventListener('click', handleHeaderClick);

function handleHeaderClick() {
  location.reload();
}

var symbol;
var keywords;
var stocks;
var bestMatchesArr = [];
var stockSearchForm = document.querySelector('#symbol-form');
var stockSearchInput = stockSearchForm.elements.stockName;
var findButton = document.querySelector('.find-button');
findButton.setAttribute('disabled', true);
var homeContainerEl = document.querySelector('.home-container');
var tabContainerEl = document.querySelector('.tab-container');
var dropdownContainerEl = document.querySelector('.dropdown-container');
var profileContainerEl = document.querySelector('.profile-container');
var chartContainerEl = document.querySelector('.daily-chart-container');
var chartButtonContainerEl = document.querySelector('.chart-buttons-container');
stockSearchInput.addEventListener('input', handleInput);
stockSearchForm.addEventListener('submit', handleSubmit);

function handleInput(event) {
  keywords = stockSearchInput.value.toUpperCase();

  if (keywords.length > 0) {
    findButton.disabled = false;
  }
}

function handleSubmit(event) {
  event.preventDefault();


  for (var i = 0; i < stocks.length; i++) {
    for (var m = 0; m < bestMatchesArr.length; m++) {
      if (keywords === stocks[i]['1. symbol'] && stocks[i]['1. symbol'] === bestMatchesArr[m]['1. symbol']) {
        symbol = stocks[i]['1. symbol'];
      }
    }
  }

  if (stocks.length === 0 || symbol === undefined) {
    location.reload();
    alert('No matching stock');
  }

  getOverviewData(symbol);
  getDailyPrices(symbol);
  getQuoteData(symbol);
  getBalanceSheetData(symbol);
  getIncomeStatementData(symbol);
  getCashFlowData(symbol);
}

findButton.addEventListener('click', handleFindClick);

function handleFindClick(event) {

  homeContainerEl.classList.remove('view');
  homeContainerEl.classList.add('hidden');
  tabContainerEl.classList.remove('hidden');
  tabContainerEl.classList.add('view');
  dropdownContainerEl.classList.remove('hidden');
  dropdownContainerEl.classList.add('view');
  profileContainerEl.classList.remove('hidden');
  profileContainerEl.classList.add('view');
  chartContainerEl.classList.remove('hidden');
  chartContainerEl.classList.add('view');
  chartButtonContainerEl.classList.remove('hidden');
  chartButtonContainerEl.classList.add('view');
}

const autoCompleteJS = new autoComplete({
  selector: '#autoComplete',
  placeHolder: 'Enter a stock ticker...',
  data: {
    src: function (query) {
      return fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=EBZ2O8GQQ9CA3ECX`)
        .then(res => res.json())
        .then(data => data.bestMatches)
        .then(bestMatches => {
          stocks = bestMatches;
          for (var i = 0; i < stocks.length; i++) {
            if (stocks[i]['8. currency'] === 'USD' && stocks[i]['3. type'] === 'Equity') {
              bestMatchesArr.push(stocks[i]);
            }
          }
          return bestMatchesArr;
        });
    },
    keys: ['1. symbol']
  },
  resultsList: {
    tag: 'ul',
    id: 'autoComplete_list',
    class: 'results_list',
    destination: '#autoComplete',
    position: 'afterend',
    maxResults: 50,
    noResults: true,
    element: (list, data) => {
      list.setAttribute('data-parent', 'stock-list');
      if (!data.results.length) {
        const message = document.createElement('div');
        message.setAttribute('class', 'no_result');
        message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
        list.prepend(message);
      }
    }
  },
  resultItem: {
    highlight: true
  },
  events: {
    input: {
      selection: event => {
        const selection = event.detail.selection.value['1. symbol'];
        autoCompleteJS.input.value = selection;
        keywords = selection;
      }
    }
  }
});

function getOverviewData(symbol) {
  var xhrOverview = new XMLHttpRequest();
  xhrOverview.open('GET', `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrOverview.responseType = 'json';
  xhrOverview.addEventListener('load', function () {

    var profileDataEl = document.querySelector('.profile-data');

    var stockNameEl = document.createElement('li');
    var stockNameLabel = document.createElement('strong');
    var stockNameData = document.createElement('span');
    profileDataEl.appendChild(stockNameEl);
    stockNameEl.appendChild(stockNameLabel);
    stockNameEl.appendChild(stockNameData);
    stockNameLabel.textContent = 'Name: ';

    if (xhrOverview.response.Name === undefined || xhrOverview.response.Name === 'None') {
      stockNameData.textContent = 'N/A';
    } else {
      stockNameData.textContent = xhrOverview.response.Name;
    }

    var exchangeNameEl = document.createElement('li');
    var exchangeNameLabel = document.createElement('strong');
    var exchangeNameData = document.createElement('span');
    profileDataEl.appendChild(exchangeNameEl);
    exchangeNameEl.appendChild(exchangeNameLabel);
    exchangeNameEl.appendChild(exchangeNameData);
    exchangeNameLabel.textContent = 'Exchange: ';

    if (xhrOverview.response.Exchange === undefined || xhrOverview.response.Exchange === 'None') {
      exchangeNameData.textContent = 'N/A';
    } else {
      exchangeNameData.textContent = xhrOverview.response.Exchange;
    }

    var sectorNameEl = document.createElement('li');
    var sectorNameLabel = document.createElement('strong');
    var sectorNameData = document.createElement('span');
    profileDataEl.appendChild(sectorNameEl);
    sectorNameEl.appendChild(sectorNameLabel);
    sectorNameEl.appendChild(sectorNameData);
    sectorNameLabel.textContent = 'Sector: ';

    if (xhrOverview.response.Sector === undefined || xhrOverview.response.Sector === 'None') {
      sectorNameData.textContent = 'N/A';
    } else {
      sectorNameData.textContent = xhrOverview.response.Sector;
    }

    var profitabilityDataEl = document.querySelector('.profitability-data');
    var prftMargin;

    if (xhrOverview.response.ProfitMargin === undefined) {
      prftMargin = null;
    } else if (xhrOverview.response.ProfitMargin !== undefined) {
      var profitMargin = xhrOverview.response.ProfitMargin;
      prftMargin = parseFloat(profitMargin).toFixed(2);
    }

    var profitMarginEl = document.createElement('li');
    var profitMarginLabel = document.createElement('strong');
    var profitMarginData = document.createElement('span');
    profitabilityDataEl.appendChild(profitMarginEl);
    profitMarginEl.appendChild(profitMarginLabel);
    profitMarginEl.appendChild(profitMarginData);
    profitMarginLabel.textContent = 'Profit Margin: ';

    if (prftMargin === null || profitMargin === undefined) {
      profitMarginData.textContent = 'N/A';
    } else {
      profitMarginData.textContent = prftMargin;
    }

    var roaTTM;

    if (xhrOverview.response.ReturnOnAssetsTTM === undefined) {
      roaTTM = null;
    } else if (xhrOverview.response.ReturnOnAssetsTTM !== undefined) {
      var returnOnAssetsTTM = xhrOverview.response.ReturnOnAssetsTTM;
      roaTTM = parseFloat(returnOnAssetsTTM).toFixed(2);
    }

    var returnOnAssetsEl = document.createElement('li');
    var returnOnAssetsLabel = document.createElement('strong');
    var returnOnAssetsData = document.createElement('span');
    profitabilityDataEl.appendChild(returnOnAssetsEl);
    returnOnAssetsEl.appendChild(returnOnAssetsLabel);
    returnOnAssetsEl.appendChild(returnOnAssetsData);
    returnOnAssetsLabel.textContent = 'Return On Assets (TTM): ';

    if (roaTTM === null || roaTTM === undefined) {
      returnOnAssetsData.textContent = 'N/A';
    } else {
      returnOnAssetsData.textContent = roaTTM;
    }

    var roeTTM;

    if (xhrOverview.response.ReturnOnEquityTTM === undefined) {
      roeTTM = null;
    } else if (xhrOverview.response.ReturnOnEquityTTM !== undefined) {
      var returnOnEquityTTM = xhrOverview.response.ReturnOnEquityTTM;
      roeTTM = parseFloat(returnOnEquityTTM).toFixed(2);
    }

    var returnOnEquityEl = document.createElement('li');
    var returnOnEquityLabel = document.createElement('strong');
    var returnOnEquityData = document.createElement('span');
    profitabilityDataEl.appendChild(returnOnEquityEl);
    returnOnEquityEl.appendChild(returnOnEquityLabel);
    returnOnEquityEl.appendChild(returnOnEquityData);
    returnOnEquityLabel.textContent = 'Return on Equity (TTM): ';

    if (roeTTM === null || roeTTM === undefined) {
      returnOnEquityData.textContent = 'N/A';
    } else {
      returnOnEquityData.textContent = roeTTM;
    }

    var omTTM;

    if (xhrOverview.response.OperatingMarginTTM === undefined) {
      omTTM = null;
    } else if (xhrOverview.response.OperatingMarginTTM !== undefined) {
      var operatingMarginTTM = xhrOverview.response.OperatingMarginTTM;
      omTTM = parseFloat(operatingMarginTTM).toFixed(2);
    }

    var operatingMarginEl = document.createElement('li');
    var operatingMarginLabel = document.createElement('strong');
    var operatingMarginData = document.createElement('span');
    profitabilityDataEl.appendChild(operatingMarginEl);
    operatingMarginEl.appendChild(operatingMarginLabel);
    operatingMarginEl.appendChild(operatingMarginData);
    operatingMarginLabel.textContent = 'Operating Margin (TTM): ';

    if (omTTM === null || omTTM === undefined) {
      operatingMarginData.textContent = 'N/A';
    } else {
      operatingMarginData.textContent = omTTM;
    }

    var valuationDataEl = document.querySelector('.valuation-data');

    var peRatio;

    if (xhrOverview.response.PERatio === undefined) {
      peRatio = null;
    } else if (xhrOverview.response.PERatio !== undefined) {
      var priceEarningsRatio = xhrOverview.response.PERatio;
      peRatio = parseFloat(priceEarningsRatio).toFixed(2);
    }

    var peRatioEl = document.createElement('li');
    var peRatioLabel = document.createElement('strong');
    var peRatioData = document.createElement('span');
    valuationDataEl.appendChild(peRatioEl);
    peRatioEl.appendChild(peRatioLabel);
    peRatioEl.appendChild(peRatioData);
    peRatioLabel.textContent = 'P/E Ratio: ';

    if (peRatio === null || peRatio === undefined) {
      peRatioData.textContent = 'N/A';
    } else {
      peRatioData.textContent = peRatio;
    }

    var pegRatio;

    if (xhrOverview.response.PEGRatio === undefined) {
      pegRatio = null;
    } else if (xhrOverview.response.PEGRatio !== undefined) {
      var priceEarningsToGrowthRatio = xhrOverview.response.PEGRatio;
      pegRatio = parseFloat(priceEarningsToGrowthRatio).toFixed(2);
    }

    var pegRatioEl = document.createElement('li');
    var pegRatioLabel = document.createElement('strong');
    var pegRatioData = document.createElement('span');
    valuationDataEl.appendChild(pegRatioEl);
    pegRatioEl.appendChild(pegRatioLabel);
    pegRatioEl.appendChild(pegRatioData);
    pegRatioLabel.textContent = 'PEG Ratio: ';

    if (pegRatio === null || pegRatio === undefined) {
      pegRatioData.textContent = 'N/A';
    } else {
      pegRatioData.textContent = pegRatio;
    }

    var pbRatio;

    if (xhrOverview.response.PriceToBookRatio === undefined) {
      pbRatio = null;
    } else if (xhrOverview.response.PriceToBookRatio !== undefined) {
      var priceToBookRatio = xhrOverview.response.PriceToBookRatio;
      pbRatio = parseFloat(priceToBookRatio).toFixed(2);
    }

    var pbRatioEl = document.createElement('li');
    var pbRatioLabel = document.createElement('strong');
    var pbRatioData = document.createElement('span');
    valuationDataEl.appendChild(pbRatioEl);
    pbRatioEl.appendChild(pbRatioLabel);
    pbRatioEl.appendChild(pbRatioData);
    pbRatioLabel.textContent = 'P/B Ratio: ';
    pbRatioData.textContent = pbRatio;

    if (pbRatio === null || pbRatio === undefined) {
      pbRatioData.textContent = 'N/A';
    } else {
      pbRatioData.textContent = pbRatio;
    }

    var psRatio;

    if (xhrOverview.response.PriceToSalesRatioTTM === undefined) {
      psRatio = null;
    } else if (xhrOverview.response.PriceToSalesRatioTTM !== undefined) {
      var priceToSalesRatio = xhrOverview.response.PriceToSalesRatioTTM;
      psRatio = parseFloat(priceToSalesRatio).toFixed(2);
    }

    var psRatioEl = document.createElement('li');
    var psRatioLabel = document.createElement('strong');
    var psRatioData = document.createElement('span');
    valuationDataEl.appendChild(psRatioEl);
    psRatioEl.appendChild(psRatioLabel);
    psRatioEl.appendChild(psRatioData);
    psRatioLabel.textContent = 'P/S Ratio: ';

    if (psRatio === null || psRatio === undefined) {
      psRatioData.textContent = 'N/A';
    } else {
      psRatioData.textContent = psRatio;
    }
  });
  xhrOverview.send();
}

function getQuoteData(symbol) {
  var xhrQuote = new XMLHttpRequest();
  xhrQuote.open('GET', `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrQuote.responseType = 'json';
  xhrQuote.addEventListener('load', function () {

    var profileDataEl = document.querySelector('.profile-data');

    var quoteEl = document.createElement('li');
    var quoteLabel = document.createElement('strong');
    var quoteData = document.createElement('span');
    profileDataEl.appendChild(quoteEl);
    quoteEl.appendChild(quoteLabel);
    quoteEl.appendChild(quoteData);
    quoteLabel.textContent = 'Quote: ';

    if (xhrQuote.response['Global Quote']['05. price'] === undefined || xhrQuote.response['Global Quote']['05. price'] === 'None') {
      quoteData.textContent = 'N/A';
    } else {
      quoteData.textContent = `$${xhrQuote.response['Global Quote']['05. price'].slice(0, -2)}`;
    }
  });
  xhrQuote.send();
}

function getDailyPrices(symbol) {
  var xhrDailyPrices = new XMLHttpRequest();
  xhrDailyPrices.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrDailyPrices.responseType = 'json';
  xhrDailyPrices.addEventListener('load', function () {
    var dailyPrices = xhrDailyPrices.response['Time Series (Daily)'];
    var dailyPriceData = [];
    dailyPriceData.push(dailyPrices);

    var closePrices = [];
    var chartLabels = [];
    var stockData = dailyPriceData[0];

    for (var key in stockData) {
      closePrices.push(stockData[key]['4. close']);
      chartLabels.push(key);
    }

    var chart = document.getElementById('dailyPriceChart');

    if (closePrices.length === 0) {
      alert('Sorry, there is no data available for this chart.');
      return;
    }

    window.myChart = new Chart(chart, {
      type: 'line',
      data: {
        labels: chartLabels.slice(0, 5).reverse(),
        datasets: [{
          label: 'Close Price by Day' + ' ' + `${symbol}`,
          data: closePrices.slice(0, 5),
          backgroundColor: 'rgba(44, 130, 201, 1)',
          borderColor: 'rgba(44, 130, 201, 1)',
          borderWidth: 1
        }]
      },
      options: {
        reversed: true
      }
    });
  });
  xhrDailyPrices.send();
}

function getIntraDayPrices(symbol) {
  var xhrIntraDayPrices = new XMLHttpRequest();
  xhrIntraDayPrices.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrIntraDayPrices.responseType = 'json';
  xhrIntraDayPrices.addEventListener('load', function () {
    var intraDayPrices = xhrIntraDayPrices.response['Time Series (5min)'];
    var intraDayPriceData = [];
    intraDayPriceData.push(intraDayPrices);

    var closePrices = [];
    var chartLabels = [];
    var stockData = intraDayPriceData[0];
    for (var key in stockData) {
      closePrices.push(stockData[key]['4. close']);
      chartLabels.push(key);
    }

    var chart = document.getElementById('dailyPriceChart');

    if (closePrices.length === 0) {
      alert('Sorry, there is no data available for this chart.');
      return;
    }

    window.myChart = new Chart(chart, {
      type: 'line',
      data: {
        labels: chartLabels.splice(0, 2).reverse(),
        datasets: [{
          label: 'Close Price Intraday' + ' ' + `${symbol}`,
          data: closePrices.splice(0, 2),
          backgroundColor: 'rgba(44, 130, 201, 1)',
          borderColor: 'rgba(44, 130, 201, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: false
      }
    });
  });
  xhrIntraDayPrices.send();
}
function getWeeklyPrices(symbol) {
  var xhrWeeklyPrices = new XMLHttpRequest();
  xhrWeeklyPrices.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrWeeklyPrices.responseType = 'json';
  xhrWeeklyPrices.addEventListener('load', function () {
    var weeklyPrices = xhrWeeklyPrices.response['Weekly Adjusted Time Series'];
    var weeklyPriceData = [];
    weeklyPriceData.push(weeklyPrices);

    var closePrices = [];
    var chartLabels = [];
    var stockData = weeklyPriceData[0];
    for (var key in stockData) {
      closePrices.push(stockData[key]['4. close']);
      chartLabels.push(key);
    }

    var chart = document.getElementById('dailyPriceChart');

    if (closePrices.length === 0) {
      alert('Sorry, there is no data available for this chart.');
      return;
    }

    window.myChart = new Chart(chart, {
      type: 'line',
      data: {
        labels: chartLabels.splice(0, 28).reverse(),
        datasets: [{
          label: 'Close Price by Week' + ' ' + `${symbol}`,
          data: closePrices.splice(0, 28),
          backgroundColor: 'rgba(44, 130, 201, 1)',
          borderColor: 'rgba(44, 130, 201, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: false
      }
    });
  });
  xhrWeeklyPrices.send();
}

function getMonthlyPrices(symbol) {
  var xhrMonthlyPrices = new XMLHttpRequest();
  xhrMonthlyPrices.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrMonthlyPrices.responseType = 'json';
  xhrMonthlyPrices.addEventListener('load', function () {
    var monthlyPrices = xhrMonthlyPrices.response['Monthly Adjusted Time Series'];
    var monthlyPriceData = [];
    monthlyPriceData.push(monthlyPrices);

    var closePrices = [];
    var chartLabels = [];
    var stockData = monthlyPriceData[0];
    for (var key in stockData) {
      closePrices.push(stockData[key]['4. close']);
      chartLabels.push(key);
    }

    var chart = document.getElementById('dailyPriceChart');

    if (closePrices.length === 0) {
      alert('Sorry, there is no data available for this chart.');
      return;
    }

    window.myChart = new Chart(chart, {
      type: 'line',
      data: {
        labels: chartLabels.splice(0, 42).reverse(),
        datasets: [{
          label: 'Close Price by Month' + ' ' + `${symbol}`,
          data: closePrices.splice(0, 42),
          backgroundColor: 'rgba(44, 130, 201, 1)',
          borderColor: 'rgba(44, 130, 201, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: false
      }
    });
  });
  xhrMonthlyPrices.send();
}

var intraDayPriceChartButton = document.querySelector('.intraday-chart-button');
intraDayPriceChartButton.addEventListener('click', function () {

  if (window.myChart != null) {
    window.myChart.destroy();
    window.myChart = null;
  }

  getIntraDayPrices(symbol);
});

var dailyPriceChartButton = document.querySelector('.daily-chart-button');
dailyPriceChartButton.addEventListener('click', function () {

  if (window.myChart != null) {
    window.myChart.destroy();
    window.myChart = null;
  }

  getDailyPrices(symbol);

});

var weeklyPriceChartButton = document.querySelector('.weekly-chart-button');
weeklyPriceChartButton.addEventListener('click', function () {

  if (window.myChart != null) {
    window.myChart.destroy();
    window.myChart = null;
  }

  getWeeklyPrices(symbol);
});

var monthlyPriceChartButton = document.querySelector('.monthly-chart-button');
monthlyPriceChartButton.addEventListener('click', function () {

  if (window.myChart != null) {
    window.myChart.destroy();
    window.myChart = null;
  }

  getMonthlyPrices(symbol);
});

function getBalanceSheetData(symbol) {
  var xhrBalanceSheet = new XMLHttpRequest();
  xhrBalanceSheet.open('GET', `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrBalanceSheet.responseType = 'json';
  xhrBalanceSheet.addEventListener('load', function () {

    var liquidityDataEl = document.querySelector('.liquidity-data');

    var currentRatio;

    if (xhrBalanceSheet.response.annualReports === undefined) {
      currentRatio = null;
    } else if (xhrBalanceSheet.response.annualReports !== undefined) {
      var totalCurrentAssests = xhrBalanceSheet.response.annualReports[0].totalCurrentAssets;
      var totalCurrentLiabilities = xhrBalanceSheet.response.annualReports[0].totalCurrentLiabilities;
      var currentRatioFormula = totalCurrentAssests / totalCurrentLiabilities;
      currentRatio = currentRatioFormula.toFixed(2);
    }

    var currentRatioEl = document.createElement('li');
    var currentRatioLabel = document.createElement('strong');
    var currentRatioData = document.createElement('span');
    liquidityDataEl.appendChild(currentRatioEl);
    currentRatioEl.appendChild(currentRatioLabel);
    currentRatioEl.appendChild(currentRatioData);
    currentRatioLabel.textContent = 'Current Ratio: ';

    if (currentRatio === null || totalCurrentAssests === null || totalCurrentAssests === undefined || totalCurrentAssests === 'None' || totalCurrentLiabilities === null || totalCurrentLiabilities === undefined || totalCurrentLiabilities === 'None') {
      currentRatioData.textContent = 'N/A';
    } else {
      currentRatioData.textContent = currentRatio;
    }

    var quickRatio;

    if (xhrBalanceSheet.response.annualReports === undefined) {
      quickRatio = null;
    } else if (xhrBalanceSheet.response.annualReports !== undefined) {
      var inventory = xhrBalanceSheet.response.annualReports[0].inventory;
      var quickRatioFormula = (totalCurrentAssests - inventory) / totalCurrentLiabilities;
      quickRatio = quickRatioFormula.toFixed(2);
    }

    var quickRatioEl = document.createElement('li');
    var quickRatioLabel = document.createElement('strong');
    var quickRatioData = document.createElement('span');
    liquidityDataEl.appendChild(quickRatioEl);
    quickRatioEl.appendChild(quickRatioLabel);
    quickRatioEl.appendChild(quickRatioData);
    quickRatioLabel.textContent = 'Quick Ratio: ';

    if (quickRatio === null || totalCurrentAssests === undefined || totalCurrentAssests === 'None' || inventory === undefined || inventory === 'None' || totalCurrentLiabilities === undefined || totalCurrentLiabilities === 'None') {
      quickRatioData.textContent = 'N/A';
    } else {
      quickRatioData.textContent = quickRatio;
    }

    var cashRatio;

    if (xhrBalanceSheet.response.annualReports === undefined) {
      cashRatio = null;
    } else if (xhrBalanceSheet.response.annualReports !== undefined) {
      var cashAndCashEquivalents = xhrBalanceSheet.response.annualReports[0].cashAndCashEquivalentsAtCarryingValue;
      var cashRatioFormula = cashAndCashEquivalents / totalCurrentLiabilities;
      cashRatio = cashRatioFormula.toFixed(2);
    }

    var cashRatioEl = document.createElement('li');
    var cashRatioLabel = document.createElement('strong');
    var cashRatioData = document.createElement('span');
    liquidityDataEl.appendChild(cashRatioEl);
    cashRatioEl.appendChild(cashRatioLabel);
    cashRatioEl.appendChild(cashRatioData);
    cashRatioLabel.textContent = 'Cash Ratio: ';

    if (cashRatio === null || cashAndCashEquivalents === undefined || cashAndCashEquivalents === 'None' || totalCurrentLiabilities === undefined || totalCurrentLiabilities === 'None') {
      cashRatioData.textContent = 'N/A';
    } else {
      cashRatioData.textContent = cashRatio;
    }

    var solvencyDataEl = document.querySelector('.solvency-data');

    var doaRatio;

    if (xhrBalanceSheet.response.annualReports === undefined) {
      doaRatio = null;
    } else if (xhrBalanceSheet.response.annualReports !== undefined) {
      var totalAssets = xhrBalanceSheet.response.annualReports[0].totalAssets;
      var totalLiabilities = xhrBalanceSheet.response.annualReports[0].totalLiabilities;
      var totalShareholderEquity = xhrBalanceSheet.response.annualReports[0].totalShareholderEquity;
    }

    var DebtToAssests = totalLiabilities / totalAssets;
    doaRatio = parseFloat(DebtToAssests).toFixed(2);

    var debtToAssetsEl = document.createElement('li');
    var debtToAssetsLabel = document.createElement('strong');
    var debtToAssetsData = document.createElement('span');
    solvencyDataEl.appendChild(debtToAssetsEl);
    debtToAssetsEl.appendChild(debtToAssetsLabel);
    debtToAssetsEl.appendChild(debtToAssetsData);
    debtToAssetsLabel.textContent = 'Debt to Assets: ';

    if (doaRatio === null || totalLiabilities === undefined || totalLiabilities === 'None' || totalAssets === undefined || totalAssets === 'None') {
      debtToAssetsData.textContent = 'N/A';
    } else {
      debtToAssetsData.textContent = doaRatio;
    }

    var debtToEquityRatio = totalLiabilities / totalShareholderEquity;
    var doeRatio = parseFloat(debtToEquityRatio).toFixed(2);

    var debtToEquityRatioEl = document.createElement('li');
    var debtToEquityRatioLabel = document.createElement('strong');
    var debtToEquityRatioData = document.createElement('span');
    solvencyDataEl.appendChild(debtToEquityRatioEl);
    debtToEquityRatioEl.appendChild(debtToEquityRatioLabel);
    debtToEquityRatioEl.appendChild(debtToEquityRatioData);
    debtToEquityRatioLabel.textContent = 'Debt to Equity: ';

    if (totalLiabilities === undefined || totalLiabilities === 'None' || totalShareholderEquity === undefined || totalShareholderEquity === 'None') {
      debtToEquityRatioData.textContent = 'N/A';
    } else {
      debtToEquityRatioData.textContent = doeRatio;
    }

    var operatingCfRatio;

    var operatingCashflowRatio = operatingCashflow / totalCurrentLiabilities;
    operatingCfRatio = parseFloat(operatingCashflowRatio).toFixed(2);

    var operatingCashflowEl = document.createElement('li');
    var operatingCashflowLabel = document.createElement('strong');
    var operatingCashflowData = document.createElement('span');
    liquidityDataEl.appendChild(operatingCashflowEl);
    operatingCashflowEl.appendChild(operatingCashflowLabel);
    operatingCashflowEl.appendChild(operatingCashflowData);
    operatingCashflowLabel.textContent = 'Operating Cashflow Ratio: ';

    if (operatingCashflow === null || operatingCashflow === undefined || operatingCashflow === 'None' || totalCurrentLiabilities === undefined || totalCurrentLiabilities === 'None') {
      operatingCashflowData.textContent = 'N/A';
    } else {
      operatingCashflowData.textContent = operatingCfRatio;
    }

    var totalShareholderEquityRatio = totalShareholderEquity / totalAssets;
    var totalSERatio = parseFloat(totalShareholderEquityRatio).toFixed(2);

    var totalSERatioEl = document.createElement('li');
    var totalSERatioLabel = document.createElement('strong');
    var totalSERatioData = document.createElement('span');
    solvencyDataEl.appendChild(totalSERatioEl);
    totalSERatioEl.appendChild(totalSERatioLabel);
    totalSERatioEl.appendChild(totalSERatioData);
    totalSERatioLabel.textContent = 'Total Shareholder Equity Ratio: ';

    if (totalShareholderEquity === undefined || totalShareholderEquity === 'None' || totalAssets === undefined || totalAssets === 'None') {
      totalSERatioData.textContent = 'N/A';
    } else {
      totalSERatioData.textContent = totalSERatio;
    }
  });
  xhrBalanceSheet.send();
}

var operatingCashflow;

function getCashFlowData(symbol) {
  var xhrCashFlow = new XMLHttpRequest();
  xhrCashFlow.open('GET', `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${symbol}&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrCashFlow.responseType = 'json';
  xhrCashFlow.addEventListener('load', function () {
    if (xhrCashFlow.response.annualReports === undefined) {
      operatingCashflow = null;
    } else if (xhrCashFlow.response.annualReports !== undefined) {
      operatingCashflow = xhrCashFlow.response.annualReports[0].operatingCashflow;
    }
    return operatingCashflow;
  });
  xhrCashFlow.send();
}

function getIncomeStatementData(symbol) {
  var xhrIncomeStatement = new XMLHttpRequest();
  xhrIncomeStatement.open('GET', `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=EBZ2O8GQQ9CA3ECX`);
  xhrIncomeStatement.responseType = 'json';
  xhrIncomeStatement.addEventListener('load', function () {

    var solvencyDataEl = document.querySelector('.solvency-data');

    var interestCoverageRatio;

    if (xhrIncomeStatement.response.annualReports === undefined) {
      interestCoverageRatio = null;
    } else if (xhrIncomeStatement.response.annualReports !== undefined) {
      var ebit = xhrIncomeStatement.response.annualReports[0].ebit;
      var interestExpense = xhrIncomeStatement.response.annualReports[0].interestExpense;
      var interestCoverageRatioFormula = ebit / interestExpense;
      interestCoverageRatio = interestCoverageRatioFormula.toFixed(2);
    }

    var interestCoverageRatioEl = document.createElement('li');
    var interestCoverageRatioLabel = document.createElement('strong');
    var interestCoverageRatioData = document.createElement('span');
    solvencyDataEl.appendChild(interestCoverageRatioEl);
    interestCoverageRatioEl.appendChild(interestCoverageRatioLabel);
    interestCoverageRatioEl.appendChild(interestCoverageRatioData);
    interestCoverageRatioLabel.textContent = 'Interest Coverage Ratio: ';

    if (interestCoverageRatio === null || ebit === undefined || ebit === 'None' || interestExpense === undefined || interestExpense === 'None') {
      interestCoverageRatioData.textContent = 'N/A';
    } else {
      interestCoverageRatioData.textContent = interestCoverageRatio;
    }
  });

  xhrIncomeStatement.send();
}

var tabContainer = document.querySelector('.tab-container');
var selectEl = document.querySelector('#stock-data-select');
var tabElements = document.querySelectorAll('.tab');
var dropdownOptions = document.querySelectorAll('.option');
var viewElements = document.querySelectorAll('.view');

function handleViewChange(dataView) {

  for (var k = 0; k < viewElements.length; k++) {
    if (viewElements[k].getAttribute('data-view') === dataView) {
      viewElements[k].className = 'view';
    } else if (dataView === 'home') {
      location.reload();
    } else {
      viewElements[k].className = 'view hidden';
    }
  }
}

tabContainer.addEventListener('click', function (event) {

  var dataView = event.target.getAttribute('data-view');
  if (!event.target.matches('.tab')) {
    return;
  }

  for (var i = 0; i < tabElements.length; i++) {
    if (tabElements[i] === event.target) {
      tabElements[i].className = 'tab active';
    } else {
      tabElements[i].className = 'tab';
    }
  }
  handleViewChange(dataView);
});

selectEl.addEventListener('change', function (event) {

  var dataView = selectEl.value;
  for (var i = 0; i < dropdownOptions.length; i++) {
    if (dropdownOptions[i] === event.target) {
      dropdownOptions[i].className = 'option active';
    } else {
      dropdownOptions[i].className = 'option';
    }
  }
  handleViewChange(dataView);
});
