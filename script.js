const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const options = document.getElementById('options-container');
const firstOption = document.getElementById('option1');
const secondOption = document.getElementById('option2');
const authorAndBtns = document.getElementById('author-buttons-containter');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const pointsContainer = document.getElementById('points')


let points = 0;
let author = '';

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

function hideAuthor() {
  authorAndBtns.hidden = true;
  option1.hidden = false;
  option2.hidden = false;
}

function showAuthor() {
  authorAndBtns.hidden = false;
  option1.hidden = true;
  option2.hidden = true;
}

// Get quote from api
async function getQuote() {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
  const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    if (data.quoteAuthor === '' || data.quoteAuthor === author) {
      throw new Error('No author or same author');
    }
    return data;
  }
  catch (error) {
     return getQuote();
  }
}

async function loadQuote() {
  hideAuthor();
  showLoadingSpinner();

  const {quoteText: quote, quoteAuthor: realAuthor} = await getQuote();
  author = realAuthor;
  const {quoteAuthor: fakeAuthor} = await getQuote();

  // Define randomly which button will have the right option
  if ((Math.floor(Math.random() * 10)) < 5) {
    firstOption.innerText = realAuthor;
    secondOption.innerText = fakeAuthor;
  } else {
    firstOption.innerText = fakeAuthor;
    secondOption.innerText = realAuthor;
  }

  // Reduce font size for long quotes
  if (quote.length > 120) {
    quoteText.classList.add('long-quote');
  } else {
    quoteText.classList.remove('long-quote');
  }
  authorText.innerText = realAuthor;
  quoteText.innerText = quote;
  removeLoadingSpinner();
}

// Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, '_blank')
}

// Check if the option clicked is the correct
function checkAuthor() {
  if (this.innerText === author) {
    points++;
  }
  pointsContainer.innerText = points === 1 ? points + ' Point' : points + ' Points';
  showAuthor()
}

// Event Listeners
newQuoteBtn.addEventListener('click', loadQuote);
twitterBtn.addEventListener('click', tweetQuote);
firstOption.addEventListener('click', checkAuthor);
secondOption.addEventListener('click', checkAuthor);

// On Load
loadQuote()
