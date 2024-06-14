var govukButtonSave = document.querySelector('.govuk-button--save')
var chapterEditForm = document.querySelector('.chapter-edit-form')
var buttonStateDelay = 1000

setUpPage()

function setUpPage() {
  govukButtonSave.addEventListener('click', changeButtonState)
  chapterEditForm.addEventListener('keydown', changeButtonState)
}

function changeButtonState(e) {
  var element = e.target

  if (element.classList.contains('govuk-button--save')) {
    element.textContent = 'Saving'

    window.setTimeout(function() {
      element.textContent = 'Saved'
    }, buttonStateDelay)
  } else {
    govukButtonSave.textContent = 'Save'
  }
}
