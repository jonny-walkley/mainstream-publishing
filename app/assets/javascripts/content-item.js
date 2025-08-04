  window.GOVUKPrototypeKit.documentReady(() => {

  let params = new URLSearchParams(document.location.search);
  let contentItemID = params.get("id");

  fetch("/public/test.json").then(data => data.json()).then(data => {

    const thePath = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const currentPage = thePath.substring(thePath.lastIndexOf('/') + 1);
    console.log(currentPage)

    data.forEach(({ title, assignee, state, format, version_number, id, scheduled, sent_out, reviewer }, index) => {
      
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

        if (status == "In review") {
        
          if (assignee !== "Esther Woods") {
            document.querySelector('#skip').style.display = 'none';
          }

          if (reviewer !== "unclaimed") {
            document.querySelector('#reviewer').innerHTML = `${reviewer}`
          } else {
            document.querySelector('#reviewer').innerHTML = `Not claimed yet`
          }
        
        }

        if (status == "Fact check sent") {
          document.querySelector('#sent-out').innerHTML = `${sent_out}`
        }

        if (status == "Scheduled") {
          document.querySelector('#scheduled').innerHTML = `${scheduled}`
        }

        if (currentPage == "content-item-edit") {
          
          // Set text input or h3 heading for title
          if (status == "Scheduled" || status == "Published" || status == "Archived") {
            document.querySelector('#title').innerHTML = title;
          } else {
            document.querySelector('#title').value = title;
          }
        
        }

      

        // For example, getElementsByTagName returns an Array-like object
        const arrayLike = document.getElementsByClassName('moj-sub-navigation__link');

        // converting to array
        const arr = Array.from(arrayLike);

        // using forEach
        arr.forEach(el => {
          console.log(el);
          el.href += `?id=${id}&content-type=${format}&status=${status}`;
        });



        // Set content item navigation links
        // document.querySelector('.moj-sub-navigation__list').innerHTML = `
        //   <li class="moj-sub-navigation__item"><a class="moj-sub-navigation__link" aria-current="page" href="content-item-edit?id=${id}&content-type=${format}&status=${status}">Edit</a></li>
        //   <li class="moj-sub-navigation__item"><a class="moj-sub-navigation__link" href="content-item-tagging?id=${id}&content-type=${format}&status=${status}">Tagging</a></li>`

      }

    });

  });
})