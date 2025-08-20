var govukButtonSave = document.querySelector('.govuk-button--save')
var chapterEditForm = document.querySelector('.chapter-edit-form')
var buttonStateDelay = 1000

if (govukButtonSave) {
  setUpPage()
}

function setUpPage() {
  govukButtonSave.addEventListener('click', changeButtonState)
  chapterEditForm.addEventListener('keydown', changeButtonState)
}

function changeButtonState(e) {
  var element = e.target

  if (element.classList.contains('govuk-button--save')) {
    element.querySelector('.govuk-button__text').textContent = 'Saving ...'
    element.classList.add('govuk-button--progress-active')
    element.setAttribute("disabled", "disabled")

    window.setTimeout(function() {
      element.querySelector('.govuk-button__text').textContent = 'Saved'
      govukButtonSave.classList.remove('govuk-button--progress-active')
      govukButtonSave.classList.add('govuk-button--progress-saved')
    }, buttonStateDelay)
  } else {
    govukButtonSave.querySelector('.govuk-button__text').textContent = 'Save'
    govukButtonSave.classList.remove('govuk-button--progress-saved')
    govukButtonSave.removeAttribute('disabled')
  }
}
