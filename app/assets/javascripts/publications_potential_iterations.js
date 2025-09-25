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

    // Get current page

    const thePath = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const currentPage = thePath.substring(thePath.lastIndexOf('/') + 1);

    // If filters are applied

    if (processParams.length !== 0 || (statusParam !== "" && statusParam !== "all" )) {
          
      // Show 'Clear filters' link
      document.querySelector('#clear-filters').innerHTML = `Clear filters`
          
      // Show active filters text
      // document.querySelector('#active-filters').innerHTML = `<p class="govuk-body govuk-!-margin-bottom-2">Active filters</p>`

      // Show active filters

      // const activeFilterElement = document.querySelector('#active-filters')

      // let isTitle = false;
      // let isAssignee = false;
      // let isFormat = false;

      // processParams.forEach((filter) => {

      //   if (filter[0] == "title") {
      //     isTitle = true;
      //     filterTitle = filter[1]
      //   } 
        
      //   if ((filter[0] == "assignee") || (filter[1] == "assignee")) {
      //     isAssignee = true;
      //     filterAssignee = filter[1].toLowerCase().replace(/\b\w/g, s => s.toUpperCase()).replaceAll("_", " ")
      //   } 

      //   if ((filter[0] == "format") || (filter[1] == "format") || (filter[2] == "format")) {
      //     isFormat = true;
      //     filterFormat = filter[1].charAt(0).toUpperCase() + String(filter[1]).slice(1);
      //   } 
        
      //  })

      // if (isTitle) {
      //   activeFilterElement.innerHTML += `<p class="active-filter">Title or slug: ${filterTitle}</p>`;
      // }
      
      // if (statusParam && statusParam !=="all") {
      //   statusParam = statusParam.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()).replaceAll("_", " ")
      //   activeFilterElement.innerHTML += `<p class="active-filter">Status: ${statusParam}</p>`;
      // }

      // if (isAssignee) {
      //   activeFilterElement.innerHTML += `<p class="active-filter">Assignee: ${filterAssignee}</p>`;
      // }

      // if (isFormat) {
      //   activeFilterElement.innerHTML += `<p class="active-filter">Content type: ${filterFormat}</p>`;
      // }

    }     








if (currentPage === "my-content-potential-iteration") {
  const taskListContainer = document.querySelector("#dynamic-task-list");
  const tagColourMap = {
    draft: "govuk-tag--yellow",
    in_2i: "govuk-tag--blue",
    amends_needed: "govuk-tag--red",
    fact_check_sent: "govuk-tag--pink",
    fact_check_received: "govuk-tag--purple",
    ready: "govuk-tag--green",
    scheduled: "govuk-tag--turquoise",
    published: "govuk-tag--orange",
    archived: "govuk-tag--grey"
  };

  function toSentenceCase(str) {
    if (!str) return "";
    const lower = str.replace(/_/g, " ").toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  // Group content
  const sections = {
    amends_needed: [],
    draft: [],
    other: []
  };

  data.forEach((item) => {
    const { assignee, state } = item;
    if (assignee === "Esther Woods" && state !== "published" && state !== "archived") {
      if (state === "amends_needed") {
        sections.amends_needed.push(item);
      } else if (state === "draft") {
        sections.draft.push(item);
      } else {
        sections.other.push(item);
      }
    }
  });

  function renderSection(heading, items) {
    if (!items.length) return;

    const sectionHeading = document.createElement("h2");
    sectionHeading.className = "govuk-heading-m";
    sectionHeading.textContent = heading;
    taskListContainer.appendChild(sectionHeading);

    const list = document.createElement("ul");
    list.className = "govuk-task-list";

    items.forEach((item, index) => {
      const { title, format, state, id, sent_out, scheduled_for } = item;
      const statusFormatted = toSentenceCase(state);
      const tagClass = tagColourMap[state] || "";
      const statusId = `item-${index}-status`;
      const hintId = `item-${index}-hint`;
      // const url = `content-item-edit?id=${id}&content-type=${format}&status=${statusFormatted}`;
      const url = `#`;

      let hintText = "";
      if (state === "fact_check_sent" && sent_out) {
        hintText = `Sent ${sent_out}`;
      } else if (state === "scheduled" && scheduled_for) {
        hintText = `Scheduled for ${scheduled_for}`;
      } else if (state === "amends_needed") {
        hintText = `Returned from 2i`;
      }

      const hasHint = !!hintText;
      const ariaDescribedBy = hasHint ? `${hintId} ${statusId}` : statusId;

      const listItem = document.createElement("li");
      listItem.className = "govuk-task-list__item govuk-task-list__item--with-link";
      listItem.innerHTML = `
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link govuk-link--no-visited-state" href="${url}" aria-describedby="${ariaDescribedBy}">
            ${title}
          </a>
          ${hasHint ? `<div id="${hintId}" class="govuk-task-list__hint">${hintText}</div>` : ""}
        </div>
        <div class="govuk-task-list__status" id="${statusId}">
          <strong class="govuk-tag ${tagClass}">
            ${statusFormatted}
          </strong>
        </div>
      `;
      list.appendChild(listItem);
    });

    taskListContainer.appendChild(list);
  }

  renderSection("Amends needed", sections.amends_needed);
  renderSection("Drafts", sections.draft);
  renderSection("Awaiting 2i, fact check and publishing", sections.other);
}














    data.forEach(({ title, assignee, state, format, version_number, id, slug, language, important_note, time_in_queue, reviewer, scheduled_for, sent_out }, index) => {
     
      assignees.push(assignee);
      let newRow = firstRow.cloneNode(true);

      const stateTagColours = {
        draft: "yellow",
        in_2i: "blue",
        amends_needed: "red",
        fact_check_sent: "pink",
        fact_check_received: "purple",
        ready: "green",
        scheduled: "turquoise",
        published: "orange",
        archived: "grey"
      };

      tagColour = stateTagColours[state];

      let status = state.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()).replaceAll("_", " ")



      if (currentPage == "my-content") {

        if (assignee == "Esther Woods") {
          if (state !== "published" && state !== "archived") {
            newRow.querySelector('.title').innerHTML = `<a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>`
            if (status == "Fact check sent") {
              newRow.querySelector('.title').innerHTML += `<span class="publication-list-dynamic-text">Sent out: ${sent_out}</span>`;
            } else if (status == "Fact check received") {
              // newRow.querySelector('.title').innerHTML += `<span class="publication-list-dynamic-text"><a href="content-item-history-and-notes?id=${id}&content-type=${format}&status=${status}#fact-check-response" class="govuk-link govuk-link--no-visited-state">View response</a></span>`;
            } else if (status == "Scheduled") {
              newRow.querySelector('.title').innerHTML += `<span class="publication-list-dynamic-text">Scheduled for: ${scheduled_for}</span>`;
            }
            newRow.querySelector('.state').innerHTML = `<strong class="govuk-tag govuk-tag--${tagColour}">${status}</strong>`
            newRow.querySelector('.format').innerText = format
            firstRow.parentNode.append(newRow)
          }
        }

      } else if (currentPage == "2i-queue") {

        if (state == "in_2i") {

          if (language == "en") {

            newRow.querySelector('.title-english').innerHTML = `
              <a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>
              <q class="important-note">${important_note}</q>`
            newRow.querySelector('.format-english').innerText = format  
            newRow.querySelector('.assignee-english').innerText = assignee
            newRow.querySelector('.time-in-queue-english').innerHTML = `<time>${time_in_queue}</time>`

            if (reviewer !== "unclaimed") {
              newRow.querySelector('.reviewer-english').innerText = reviewer
            } else {
              newRow.querySelector('.reviewer-english').innerHTML = `<button class='govuk-button'>Claim 2i</button>`
            }

            firstRow.parentNode.append(newRow)

          } else {

            let welshTable = document.querySelectorAll(".govuk-table")[1];
            let firstRowWelsh = welshTable.querySelectorAll(".govuk-table__row")[1];
            let newRowWelsh = firstRowWelsh.cloneNode(true);

            newRowWelsh.querySelector('.title-welsh').innerHTML = `
              <a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>
              <q class="important-note">${important_note}</q>`
            newRowWelsh.querySelector('.format-welsh').innerText = format
            newRowWelsh.querySelector('.assignee-welsh').innerText = assignee
            newRowWelsh.querySelector('.time-in-queue-welsh').innerHTML = `<time>${time_in_queue}</time>`

            if (reviewer !== "unclaimed") {
              newRowWelsh.querySelector('.reviewer-welsh').innerText = reviewer
            } else {
              newRowWelsh.querySelector('.reviewer-welsh').innerHTML = `<button class='govuk-button'>Claim 2i</button>`
            }

            firstRowWelsh.parentNode.append(newRowWelsh)

          }

        }

      } else if (currentPage == "fact-check") {

        if (state == "fact_check_received") {
         
          newRow.querySelector('.title-received').innerHTML = `<a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>`
        newRow.querySelector('.view-response').innerHTML = `<a href="content-item-history-and-notes?id=${id}&content-type=${format}&status=${status}#accordion-history-and-notes" class="govuk-link govuk-link--no-visited-state">View response</a>`
          newRow.querySelector('.assignee-received').innerText = assignee
          newRow.querySelector('.format-received').innerText = format  
          firstRow.parentNode.append(newRow)
        
        } else if (state == "fact_check_sent") {

          let sentTable = document.querySelectorAll(".govuk-table")[1];
          let firstRowSent = sentTable.querySelectorAll(".govuk-table__row")[1];
          let newRowSent = firstRowSent.cloneNode(true);

          newRowSent.querySelector('.title-sent').innerHTML = `<a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a>`
          newRowSent.querySelector('.assignee-sent').innerText = assignee
          newRowSent.querySelector('.format-sent').innerText = format
          firstRowSent.parentNode.append(newRowSent)

        }

      } else { // Current page is 'All publications'

        newRow.querySelector('.title').innerHTML = `<a href="content-item-edit?id=${id}&content-type=${format}&status=${status}" class="govuk-link govuk-link--no-visited-state">${title}</a><span class="slug">/${slug}</span>`
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
    } else if (currentPage == "2i-queue") {
      document.querySelectorAll(".govuk-table")[1].querySelectorAll(".govuk-table__row")[1].remove()
    }
    
    
    
    

    
    
    
    // Populate the number of results heading and show/hide elements if no results

    let count = document.querySelectorAll('.govuk-table__body .govuk-table__row').length;
    
    function toPlural(count, single) {
      return `${single}${count === 1 ? "" : "s"}`;
    };

    let itemCount = document.querySelector('#item-count');
    if (itemCount) {
      itemCount.innerHTML = `${count} ${toPlural(count, "item")}`
    }
    // document.querySelector('#item-count').innerHTML = `${count} ${toPlural(count, "item")}`
    // console.log(count);

    if (count === 0) {
      document.querySelector('.govuk-table').style.display = 'none';
    }




    // Count items in both tables and display the count in each table

    if (currentPage == "2i-queue" || currentPage == "fact-check") {

      let numberOfFirstTableItems = document.querySelectorAll(".govuk-table")[0].querySelectorAll('.govuk-table__body .govuk-table__row').length;
      let numberOfSecondTableItems = document.querySelectorAll(".govuk-table")[1].querySelectorAll('.govuk-table__body .govuk-table__row').length;

      let captionFirstTable = document.querySelectorAll(".govuk-table")[0].querySelectorAll('.govuk-table__caption')[0];
      captionFirstTable.innerHTML += `<span class="item-count">${numberOfFirstTableItems} ${toPlural(numberOfFirstTableItems, "item")}</span>`;

      let captionSecondTable = document.querySelectorAll(".govuk-table")[1].querySelectorAll('.govuk-table__caption')[0];
      captionSecondTable.innerHTML += `<span class="item-count">${numberOfSecondTableItems} ${toPlural(numberOfSecondTableItems, "item")}</span>`;
      
    }







  });
})