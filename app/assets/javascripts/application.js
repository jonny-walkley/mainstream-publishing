//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here

  console.log(document.querySelector("#assignee"))

  fetch("/public/test.json").then(data => data.json()).then(data => {
    let firstRow = document.querySelectorAll(".govuk-table__row")[1];

    data.forEach(({ title, assignee, state }) => {
      let newRow = firstRow.cloneNode(true);

      newRow.querySelector('.title').innerHTML = `<a href="#">${title}</a>`
      newRow.querySelector('.assignee').innerText = assignee
      newRow.querySelector('.state').innerHTML = `<strong class="govuk-tag">${state}</strong>`

      firstRow.parentNode.append(newRow)
    });
  });

  accessibleAutocomplete.enhanceSelectElement({
    selectElement: document.querySelector("#assignee")
  });  
})
