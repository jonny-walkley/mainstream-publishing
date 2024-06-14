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
    element.querySelector('span').textContent = 'Saving ...'
    element.querySelector('span').classList.remove('save')
    element.querySelector('span').classList.add('saving')

    window.setTimeout(function() {
      element.querySelector('span').textContent = 'Saved'
      element.querySelector('span').classList.remove('saving')
      element.querySelector('span').classList.add('saved')
    }, buttonStateDelay)
  } else {
    govukButtonSave.querySelector('span').textContent = 'Save'
  }
}
