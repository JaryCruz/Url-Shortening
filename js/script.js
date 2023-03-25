const textInput = document.querySelector('[data-input]')
const btnSubmit = document.querySelector('[data-btn-submit]')
const spanError = document.querySelector('[data-error]')
const linkContainer = document.querySelector('[data-links-container]')
const linkTemplate = document.querySelector('#template-link')
const mobileMenu = document.querySelector('[data-mobile-menu]')
const btnHamburger = document.querySelector('[data-btn-hamburger]')
const shortenedLinks = JSON.parse(localStorage.getItem('shortenedLinks')) || []


btnSubmit.addEventListener('click', submitLink)
btnHamburger.addEventListener('click', toggleMenu)

// Display Stored Links
shortenedLinks.forEach(link => {
  const {original_link, full_short_link} = link
  const shortLink = linkTemplate.content.cloneNode(true)
  shortLink.querySelector('span').innerText = original_link
  shortLink.querySelector('small').innerText = full_short_link
  shortLink.querySelector('button').addEventListener('click', (e) => {
    changeButtonState(e)
    copyShortUrl(full_short_link)
  })
  linkContainer.append(shortLink)
})

function toggleMenu() {
  mobileMenu.classList.toggle('hidden')
  btnHamburger.classList.toggle('open')
}

function submitLink() {
  if (textInput.value === '') {
    spanError.classList.remove('hidden')
    textInput.style.border = '2px solid red'
  } else {
    spanError.classList.add('hidden')
    textInput.style.outline = 'none'
    getLink(textInput.value)
    textInput.value = ''
  }
}

async function getLink(url) {
  await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
    .then(data => data.json())
    .then(data => makeLinkCard(data))
}

function makeLinkCard({ result: { original_link, full_short_link } }) {
  const shortLink = linkTemplate.content.cloneNode(true)
  shortLink.querySelector('span').innerText = original_link
  shortLink.querySelector('small').innerText = full_short_link
  shortLink.querySelector('button').addEventListener('click', (e) => {
    changeButtonState(e)
    copyShortUrl(full_short_link)
  })
  // Store link in local storage
  shortenedLinks.push({full_short_link, original_link})
  localStorage.setItem('shortenedLinks', JSON.stringify(shortenedLinks))

  linkContainer.append(shortLink)
}

function copyShortUrl(url) {
  navigator.clipboard.writeText(url)
}

function changeButtonState(e) {
  const btnCopy = e.target
  btnCopy.style.backgroundColor = 'hsl(257, 27%, 26%)'
  btnCopy.innerText = 'Copied!'
}