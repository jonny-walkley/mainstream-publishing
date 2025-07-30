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
    let statusParam = params.get("state") || "";

    let whitelist = [
      'title',
      'assignee',
      'format',
      'status'
    ]

    let matchExact = {
      title: false,
      assignee: true,
      format: true,
      state: true,
    }

    let processParams = filterParams(whitelist, new URL(document.location).searchParams.entries());
    let states = filterParams(['state'], new URL(document.location).searchParams.entries());


    // Show 'Clear filters' link if filters are applied

    if (processParams.length !== 0 || (statusParam !== "" && statusParam !== "all" )) {

      document.querySelector('#clear-filters').innerHTML = `Clear filters`
      document.querySelector('#active-filters').innerHTML = `<p class="govuk-body">Active filters</p>`

      processParams.forEach((filter) => {
       
        console.log("filter: " + filter[0]);
        console.log("value: " + filter[1]);
        const activeFilterElement = document.querySelector('#active-filters')
        activeFilterElement.innerHTML += `<p class="active-filter">${filter[0]}: ${filter[1]}</p>`;
      
      })
      
    }

    // Get current page

    const thePath = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const currentPage = thePath.substring(thePath.lastIndexOf('/') + 1);

    data.forEach(({ title, assignee, state, format, version_number, id }, index) => {
     
      assignees.push(assignee);
      let newRow = firstRow.cloneNode(true);

      switch (state) {
        case "draft":
          tagColour = "yellow"
          break;
        case "in_review":
          tagColour = "blue"
          break;
        case "amends_needed":
          tagColour = "red"
          break;
        case "fact_check_sent":
          tagColour = "pink"
          break;
        case "fact_check_received":
          tagColour = "purple"
          break;
        case "ready":
          tagColour = "green"
          break;
        case "scheduled_for_publishing":
          tagColour = "turquoise"
          state = "Scheduled"
          break;
        case "published":
          tagColour = "orange"
          break;
        case "archived":
          tagColour = "grey"
          break;
      }

      let status = state.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()).replaceAll("_", " ")




      if (currentPage == "my-content") {

      
              console.log(version_number);

        if (assignee == "Esther Woods") {
          if (state !== "published" && state !== "archived") {
            newRow.querySelector('.title').innerHTML = `<a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>`
            // newRow.querySelector('.title').innerHTML = `<a href="content-item-edit?title=${title}&content-type=${format}&assignee=${assignee}&status=${status}&tagColour=${tagColour}&edition=${version_number}" class="govuk-link govuk-link--no-visited-state">${title}</a>`
            newRow.querySelector('.state').innerHTML = `<strong class="govuk-tag govuk-tag--${tagColour}">${status}</strong>`
            // newRow.querySelector('.assignee').innerText = assignee
            newRow.querySelector('.format').innerText = format  
            firstRow.parentNode.append(newRow)
          }
        }

      } else if (currentPage == "2i-queue") {

        if (state == "in_review") {
          newRow.querySelector('.title').innerHTML = `
            <a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>
            <q class="important-note">Quick fix. No FC needed. Please 2i, publish and leave a comment on the Trello card - no need to move the Trello card.
            The issue was identified by automatic Siteimprove checks which flag potential style and accessibility issues.</q>`
          // newRow.querySelector('.state').innerHTML = `<strong class="govuk-tag govuk-tag--${tagColour}">${status}</strong>`
          newRow.querySelector('.assignee').innerText = assignee
          newRow.querySelector('.format').innerText = format  
          firstRow.parentNode.append(newRow)
        }

      } else if (currentPage == "fact-check") {

        if (state == "fact_check_received") {
          newRow.querySelector('.title-received').innerHTML = `<a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>`
          // newRow.querySelector('.title-received').innerHTML = `<a href="#" class="govuk-link govuk-link--no-visited-state">${title}</a><a href="#" class="view-response">View response</a>`
          // newRow.querySelector('.state-received').innerHTML = `<strong class="govuk-tag govuk-tag--${tagColour}">${status}</strong>`
          newRow.querySelector('.assignee-received').innerText = assignee
          newRow.querySelector('.format-received').innerText = format  
          firstRow.parentNode.append(newRow)
        } else if (state == "fact_check_sent") {

          let sentTable = document.querySelectorAll(".govuk-table")[1];
          let firstRowSent = sentTable.querySelectorAll(".govuk-table__row")[1];
          let newRowSent = firstRowSent.cloneNode(true);

          newRowSent.querySelector('.title-sent').innerHTML = `<a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>`
          // newRowSent.querySelector('.state-sent').innerHTML = `<strong class="govuk-tag govuk-tag--${tagColour}">${status}</strong>`
          newRowSent.querySelector('.assignee-sent').innerText = assignee
          newRowSent.querySelector('.format-sent').innerText = format
          firstRowSent.parentNode.append(newRowSent)

        }

      } else {

        newRow.querySelector('.title').innerHTML = `<a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a><span class="slug">/this-is-a-slug</span>`
        newRow.querySelector('.state').innerHTML = `<strong class="govuk-tag govuk-tag--${tagColour}">${status}</strong>`
        newRow.querySelector('.assignee').innerText = assignee
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

      }

    });

    // If current page is all publications then do filter stuff

    if (currentPage == "all-publications") {

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
      
      accessibleAutocomplete.enhanceSelectElement({
        selectElement: document.querySelector("#assignee")
      });

      // Show selected filters in their fields
      
      if (titleParam && titleParam.length > 0) {
        document.querySelector("#title").value = titleParam;
      }

      if (statusParam && statusParam.length > 0) {
        document.querySelector(`#status option[value='${statusParam}']`).setAttribute('selected', true)
      }

      if (formatParam && formatParam.length > 0) {
        document.querySelector(`#format option[value='${formatParam}']`).setAttribute('selected', true)
      }

      // if (states && states.length > 0) {
      //   document.querySelector(`#status option[value='${states}']`).setAttribute('selected', true)
      // }

    }

    // Remove first row in table as it is table header

    firstRow.remove();

    if (currentPage == "fact-check") {
      document.querySelectorAll(".govuk-table")[1].querySelectorAll(".govuk-table__row")[1].remove()
    }
    
    // Populate the number of results heading and show/hide elements if no results

    let count = document.querySelectorAll('.govuk-table__body .govuk-table__row').length;
    
    function toPlural(count, single) {
      return `${single}${count === 1 ? "" : "s"}`;
    };

    document.querySelector('#item-count').innerHTML = `${count} ${toPlural(count, "item")}`

    if (count === 0) {
      document.querySelector('.govuk-table').style.display = 'none';
    }

  });
})