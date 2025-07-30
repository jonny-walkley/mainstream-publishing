  window.GOVUKPrototypeKit.documentReady(() => {

  const matchParam = (param, input, exact) =>
    input && ((input.replace(' ','').toLowerCase()).match(
      !exact ? param.replace(' ','').toLowerCase() : new RegExp(`^${param.replace(' ','').toLowerCase()}$`)
    ));

  const filterParams = (whitelist, searchParams) =>
    Array.from(new URL(document.location).searchParams.entries()).filter(param => whitelist.includes(param[0]) && param[1].length && param[1] !='_unchecked' && param[1] != 'all');

  let params2 = new URLSearchParams(document.location.search);
  let contentItemID = params2.get("id");

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

    data.forEach(({ title, assignee, state, format, version_number, id }, index) => {
      
      if (id == contentItemID) {

        let status = state.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()).replaceAll("_", " ")

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
            status = "Scheduled"
            break;
          case "published":
            tagColour = "orange"
            break;
          case "archived":
            tagColour = "grey"
            break;
        }
              
        // Set content type
        document.querySelector('.govuk-caption-xl').innerHTML = `${format}`

        // Set title
        document.querySelector('.govuk-heading-xl').innerHTML = `${title}`

        // Set edition number and status
        document.querySelector('#edition').innerHTML = `${version_number}<strong class="govuk-tag govuk-tag--${tagColour} govuk-!-margin-left-2">${status}</strong>`

        // Set assigned to
        document.querySelector('#assignee').innerHTML = `${assignee}`

        // Hide the 'Skip review' button if content item is in review and not assigned to current user
        if (status == "In review" && assignee !== "Esther Woods") {
          document.querySelector('#skip').style.display = 'none';
        }

        // Set title
        if (status == "Scheduled" || status == "Published" || status == "Archived") {
         document.querySelector('#title').innerHTML = title;
        } else {
          document.querySelector('#title').value = title;
        }

      }

    });

  });
})