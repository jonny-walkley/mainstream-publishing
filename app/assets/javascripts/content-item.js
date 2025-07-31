  window.GOVUKPrototypeKit.documentReady(() => {

  let params = new URLSearchParams(document.location.search);
  let contentItemID = params.get("id");

  fetch("/public/test.json").then(data => data.json()).then(data => {

    data.forEach(({ title, assignee, state, format, version_number, id, scheduled, sent_out }, index) => {
      
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
              
        // Set caption content type 
        document.querySelector('.govuk-caption-xl').innerHTML = `${format}`

        // Set h1 heading title
        document.querySelector('.govuk-heading-xl').innerHTML = `${title}`

        // Set edition number and status
        document.querySelector('#edition').innerHTML = `${version_number}<strong class="govuk-tag govuk-tag--${tagColour} govuk-!-margin-left-2">${status}</strong>`

        // Set assigned to
        document.querySelector('#assignee').innerHTML = `${assignee}`

        // Hide the 'Skip review' button if content item is 'In review' and not assigned to current user
        if (status == "In review" && assignee !== "Esther Woods") {
          document.querySelector('#skip').style.display = 'none';
        }

        if (status == "Fact check sent") {
          document.querySelector('#sent-out').innerHTML = `${sent_out}`
        }

        if (status == "Scheduled") {
          document.querySelector('#scheduled').innerHTML = `${scheduled}`
        }

        // Set text input or h3 heading for title
        if (status == "Scheduled" || status == "Published" || status == "Archived") {
          document.querySelector('#title').innerHTML = title;
        } else {
          document.querySelector('#title').value = title;
        }

      }

    });

  });
})