var govukButtonSave = document.querySelector('.govuk-button--save')

console.log('govukButtonSave: ', govukButtonSave)

govukButtonSave.addEventListener('click', changeButtonState)

function changeButtonState(e) {
  e.target.textContent = 'Saving'

  window.setTimeout(function() {
    e.target.textContent = 'Saved'
  }, 1000)
}
