//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  const matchParam = (param, input, exact) =>
    input && ((input.replace(' ','').toLowerCase()).match(
      !exact ? param.replace(' ','').toLowerCase() : new RegExp(`^${param.replace(' ','').toLowerCase()}$`)
    ))

  fetch("/public/test.json").then(data => data.json()).then(data => {
    let firstRow = document.querySelectorAll(".govuk-table__row")[1];
    let assignees = [];

    let params = new URL(document.location).searchParams;
    let titleParam = params.get("title") || "" ;
    let assigneeParam = params.get("assignee") || "";

    if (titleParam && titleParam.length > 0) {
      document.querySelector("#title").value = titleParam;
    }

    data.forEach(({ title, assignee, state, format }, index) => {
      assignees.push(assignee);

      let newRow = firstRow.cloneNode(true);
      newRow.querySelector('.title').innerHTML = `<a href="#">${title}</a>`
      newRow.querySelector('.assignee').innerText = assignee
      newRow.querySelector('.state').innerHTML = `<strong class="govuk-tag">${state}</strong>`
      newRow.querySelector('.format').innerText = format   

      let whitelist = [
        'title',
        'assignee',
        'format',
        'state'
      ]

      let matchExact = {
        title: false,
        assignee: true,
        format: true,
        state: true,
      }

      let params = Array.from(new URL(document.location).searchParams.entries()).filter(param => whitelist.includes(param[0]) && param[1].length && param[1]!='_unchecked');

      // ...i guess it's an AND filter...
      if (params.length) {
        if (params.filter(param => matchParam(param[1], data[index][param[0]], matchExact[param[0]])).length == params.length) {
          firstRow.parentNode.append(newRow)  
        }
      } else {
        firstRow.parentNode.append(newRow)
      }
    });

    firstRow.remove();

    Array.from((new Set(assignees))).forEach(function(assignee) {
      let option = document.createElement("option");
      option.value = assignee.replace(' ','').toLowerCase();
      option.innerText = assignee;
      document.querySelector("#assignee").appendChild(option);    
    });

    accessibleAutocomplete.enhanceSelectElement({
      selectElement: document.querySelector("#assignee")
    });    
  });
})
