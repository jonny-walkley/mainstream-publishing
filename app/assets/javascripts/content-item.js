  window.GOVUKPrototypeKit.documentReady(() => {

  let params = new URLSearchParams(document.location.search);
  let contentItemID = params.get("id");

  fetch("/public/test.json").then(data => data.json()).then(data => {

    const thePath = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const currentPage = thePath.substring(thePath.lastIndexOf('/') + 1);

    data.forEach(({ title, assignee, state, format, version_number, id, scheduled, sent_out, reviewer, slug, important_note, meta_tag_description, language, lgsl_code, lgil_code, places_manager_service_identifier, body }, index) => {
      
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

        if (currentPage !== "content-item-2i") {
        
          // Set caption as content type 
          document.querySelector('.govuk-caption-xl').innerHTML = `${format}`

          // Set h1 heading as publication title
          document.querySelector('.govuk-heading-xl').innerHTML = `${title}`
        
        } else {

          // Set caption as publication title 
          document.querySelector('.govuk-caption-xl').innerHTML = `${title}`

          // Set cancel link to go back to publication
          document.querySelector('#cancel-link').href = `content-item-edit?id=${id}&content-type=${format}&status=${status}`
        
        }

        // Set edition number and status
        document.querySelector('#edition').innerHTML = `${version_number}<strong class="govuk-tag govuk-tag--${tagColour} govuk-!-margin-left-2">${status}</strong>`

        // Set assigned to
        document.querySelector('#assignee').innerHTML = `${assignee}`

        // Hide the 'Skip review' button if content item is 'In review' and not assigned to current user

        if (status == "In review") {

          if (currentPage == "content-item-edit" || currentPage == "content-item-history-and-notes") {
            if (assignee !== "Esther Woods") {
              document.querySelector('#skip').style.display = 'none';
            }
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

          if (format == "Local transaction") {
            document.querySelector('#lgsl-code').innerHTML = lgsl_code;
            document.querySelector('#lgil-code').value = lgil_code;
          }

          if (format == "Place") {
            document.querySelector('#places-manager-service-identifier').value = places_manager_service_identifier;
          }

          if (format == "Answer" || format == "Help page") {
            if (body) {
              document.querySelector('#body').value = body;
            }
          }
        
        }

        if (currentPage == "content-item-metadata") {

          if (status == "Scheduled" || status == "Published" || status == "Archived") {
            
            document.querySelector('#slug').innerHTML = `${slug}`
            document.querySelector('#meta-tag-description').innerHTML = `${meta_tag_description}`
            if (language == "en") {
              document.querySelector('#language').innerHTML = "English";
            } else {
              document.querySelector('#language').innerHTML = "Welsh";
            }
          
          } else {
            
            document.querySelector('#slug').value = slug;
            document.querySelector('#meta-tag-description').value = meta_tag_description;

            if (version_number > 1) {
              document.querySelector('#slug-hint').innerHTML = "If you change the slug, the old slug will automatically redirect to the new one";
            } else {
              document.querySelector('#slug-hint').innerHTML = "Must be written in the following format: lower-case-hypen-separated";
            }

            if (language == "en") {
              document.querySelector('#language-english').checked = true;
            } else {
              document.querySelector('#language-welsh').checked = true;
            }

          }

          if (format == "Completed transaction") {
            document.querySelector('#meta-tag-description-heading').style.display = 'none';
          }


          
        }

        if (currentPage == "content-item-history-and-notes") {
         
          if(important_note) {
            document.querySelector('#important-note').style.display = 'block';
            document.querySelector('#important-note-button').innerHTML = "Update important note";
            document.querySelector('#important-note-body').innerHTML = important_note;
          }

          if (status == "Fact check received") {
            document.querySelector('#fact-check-response').style.display = 'block';
          }

          if (status !== "Draft") {
            
            document.querySelector('#review-requested').style.display = 'block';
          }
        
          const assigneeInstances = document.getElementsByClassName('assignee');
        
          const assigneeInstancesArr = Array.from(assigneeInstances);
            
          assigneeInstancesArr.forEach(el => {
            el.innerHTML = assignee;
          });

        }

        // Set send to 2i link

        if (currentPage == "content-item-edit" || currentPage == "content-item-history-and-notes") {
          if (status == "Draft" || status == "Amends needed") {
            document.querySelector('#send-to-2i').href = `content-item-2i?id=${id}&content-type=${format}&status=${status}`;
          }
        }

        // returns array-like object
        const arrayLike = document.getElementsByClassName('moj-sub-navigation__link');

        // convert to array
        const arr = Array.from(arrayLike);

        // loop through
        arr.forEach(el => {
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