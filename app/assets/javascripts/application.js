//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  const matchParam = (param, input, exact) =>
    input && ((input.replace(' ','').toLowerCase()).match(
      !exact ? param.replace(' ','').toLowerCase() : new RegExp(`^${param.replace(' ','').toLowerCase()}$`)
    ));

  const filterParams = (whitelist, searchParams) =>
    Array.from(new URL(document.location).searchParams.entries()).filter(param => whitelist.includes(param[0]) && param[1].length && param[1] !='_unchecked' && param[1] != 'all');

  fetch("/public/test.json").then(data => data.json()).then(data => {
    let firstRow = document.querySelectorAll(".govuk-table__row")[1];
    let assignees = [];

    let params = new URL(document.location).searchParams;
    let titleParam = params.get("title") || "" ;
    let assigneeParam = params.get("assignee") || "";
    let formatParam = params.get("format") || "";

    let whitelist = [
      'title',
      'assignee',
      'format',
    ]

    let matchExact = {
      title: false,
      assignee: true,
      format: true,
      state: true,
    }

    let processParams = filterParams(whitelist, new URL(document.location).searchParams.entries());
    let states = filterParams(['state'], new URL(document.location).searchParams.entries());

    if (titleParam && titleParam.length > 0) {
      document.querySelector("#title").value = titleParam;
    }

    states.forEach((state) => {
      document.querySelector(`input[value="${state[1]}"]`).setAttribute('checked', true)
    })

    data.forEach(({ title, assignee, state, format }, index) => {
      assignees.push(assignee);

      let newRow = firstRow.cloneNode(true);
      newRow.querySelector('.title').innerHTML = `<a href="#">${title}</a>`
      newRow.querySelector('.assignee').innerText = assignee
      newRow.querySelector('.state').innerHTML = `<strong class="govuk-tag">${state}</strong>`
      newRow.querySelector('.format').innerText = format

      // OR
      if (states.length) {
        if (states.filter(param => matchParam(param[1], data[index][param[0]], matchExact[param[0]])).length == 0) {
          return;
        }
      }

      // AND
      if (processParams.length) {
        if (processParams.filter(param => matchParam(param[1], data[index][param[0]], matchExact[param[0]])).length == processParams.length) {
          firstRow.parentNode.append(newRow)
        }
      } else {
        firstRow.parentNode.append(newRow)
      }
    });

    firstRow.remove();

    Array.from((new Set(assignees))).forEach(function(assignee) {
      let option = document.createElement("option");
      let value = assignee.replace(' ','').toLowerCase();
      option.value = value;
      option.innerText = assignee;

      if (assigneeParam && assigneeParam.length > 0) {
        if (matchParam(assigneeParam, value, true)) {
          option.setAttribute('selected', true)
        }
      }

      document.querySelector("#assignee").appendChild(option);
    });

    if (formatParam && formatParam.length > 0) {
      document.querySelector(`#format option[value='${formatParam}']`).setAttribute('selected', true)
    }

    accessibleAutocomplete.enhanceSelectElement({
      selectElement: document.querySelector("#assignee"),
    });

    document.querySelector('#doc-count').innerHTML = `${document.querySelectorAll('.govuk-table__body .govuk-table__row').length} documents`
  });
})
