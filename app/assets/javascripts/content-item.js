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
          case "in_2i":
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

        // --- Overall ---
        
        // Set caption as content type 
        document.querySelector('.govuk-caption-xl').innerHTML = `${format}`

        // Set h1 heading as publication title
        document.querySelector('.govuk-heading-xl').innerHTML = `${title}`

        // Set edition number and status
        document.querySelector('#edition').innerHTML = `${version_number}<strong class="govuk-tag govuk-tag--${tagColour} govuk-!-margin-left-2">${status}</strong>`

        // Set assigned to
        document.querySelector('#assignee').innerHTML = `${assignee}`

        // Set sub navigation page links
        const subNav = document.getElementsByClassName('moj-sub-navigation__link');
        const subNavArray = Array.from(subNav);

        subNavArray.forEach(navItem => {
          navItem.href += `?id=${id}&content-type=${format}&status=${status}`;
        });
        
  
        // --- Page-specifc ---

        switch (currentPage) {

          case "content-item-edit":

            // Set 'Title', either text input field or h3 heading
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

            // Set action links if status is 'Ready'
            if (status == "Ready") {
              document.querySelector('#fact-check').href = `content-item-fact-check?id=${id}&content-type=${format}&status=${status}`;
              document.querySelector('#schedule').href = `content-item-schedule?id=${id}&content-type=${format}&status=${status}`;
              document.querySelector('#publish').href = `content-item-publish?id=${id}&content-type=${format}&status=${status}`;
            }
            
            break;
          
          case "content-item-metadata":

            if (status == "Scheduled" || status == "Published" || status == "Archived") {
              
              document.querySelector('#slug').innerHTML = `${slug}`
              document.querySelector('#meta-tag-description').innerHTML = `${meta_tag_description}`
              
              const languageElement = document.querySelector('#language');

              if (language == "en") {
                languageElement.innerHTML = "English";
              } else {
                languageElement.innerHTML = "Welsh";
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

            break;
          
          case "content-item-history-and-notes":

            document.querySelector('#edition-note').href = `content-item-add-edition-note?id=${id}&content-type=${format}&status=${status}`;
            document.querySelector('#important-note-button').href = `content-item-important-note?id=${id}&content-type=${format}&status=${status}`;

            if (important_note) {
              document.querySelector('#important-note').style.display = 'block';
              document.querySelector('#important-note-button').innerHTML = "Update important note";
              document.querySelector('#important-note-body').innerHTML = important_note;
            }

            document.querySelector('#current-edition').innerHTML += `${version_number}`

            const compareLink = document.querySelector('#current-edition-compare');

            if (version_number > 1) {
              compareLink.innerHTML += `${version_number-1}`
              compareLink.href = `content-item-compare-with-edition?id=${id}&content-type=${format}&status=${status}`
            } else {
              compareLink.style.display = 'none';
              document.querySelector('#first-event').innerHTML = "New content";
            }

            if (status !== "Fact check received") {
              document.querySelector('#fact-check-response').style.display = 'none';
            }

            if (status !== "Draft") {
              document.querySelector('#review-requested').style.display = 'block';
              if (reviewer && reviewer !== "unclaimed") {
                
                document.querySelector('#claimed-by').style.display = 'block';

                if (status == "Amends needed") {
                
                  document.querySelector('#amends-needed').style.display = 'block';
                  // Loop through instances where 2i reviewer name needs to show
                  const reviewerInstances = document.getElementsByClassName('claimed-by-name');
                  const reviewerInstancesArr = Array.from(reviewerInstances);
                  reviewerInstancesArr.forEach(el => {
                    el.innerHTML = reviewer;
                  });
                
                }

              }
            }
        
            const assigneeInstances = document.getElementsByClassName('assignee');
            const assigneeInstancesArr = Array.from(assigneeInstances);
            
            assigneeInstancesArr.forEach(el => {
              el.innerHTML = assignee;
            });



            // Add accordions for previous edititons

            const totalEditions = new Array(version_number);
            totalPreviousEditions = totalEditions.length-1;
            editionsAccordion = document.querySelector('#accordion-history-and-notes')

            for(let i = totalPreviousEditions; i > 0; i-- ) {
              
              editionsAccordion.innerHTML += `
                <div class="govuk-accordion__section">
                  <div class="govuk-accordion__section-header">
                    <h2 class="govuk-accordion__section-heading">
                      <button type="button" aria-controls="accordion-history-and-notes-content-${i}" class="govuk-accordion__section-button" aria-expanded="false" aria-label="Edition ${i} , Show this section">
                        <span class="govuk-accordion__section-heading-text" id="accordion-history-and-notes-heading-${i}">
                          <span class="govuk-accordion__section-heading-text-focus">
                            Edition ${i}
                          </span>
                        </span>
                        <span class="govuk-visually-hidden govuk-accordion__section-heading-divider">, </span>
                        <span class="govuk-accordion__section-toggle" data-nosnippet="">
                          <span class="govuk-accordion__section-toggle-focus">
                            <span class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
                            <span class="govuk-accordion__section-toggle-text">Show</span>
                          </span>
                        </span>
                      </button>
                    </h2>
                  </div>
                  <div id="accordion-history-and-notes-content-${i}" class="govuk-accordion__section-content" hidden="until-found">
                    <p class="govuk-body">To-do.</p>
                  </div>
                </div>
              `;
            
            }

            break;

          case "content-item-admin":

            console.log(status)

            if (status == "Published") {
              document.querySelector('#unpublish').href = `content-item-unpublish?id=${id}&content-type=${format}&status=${status}`
            }

            if (version_number == 1) {
              document.querySelector('#add-a-public-change-note').style.display = 'none';
            }

            break;

        }

        // Hide the 'Skip 2i' button if content item is 'In 2i' and not assigned to current user

        if (status == "In 2i") {

          if (currentPage == "content-item-edit" || currentPage == "content-item-history-and-notes") {
            if (assignee !== "Esther Woods") {
              document.querySelector('#skip').style.display = 'none';
            }
          }

          if (reviewer !== "unclaimed") {
            document.querySelector('#reviewer').innerHTML = `${reviewer}`
            document.querySelector('#reviewer-link').innerHTML = `Change<span class="govuk-visually-hidden">2i reviewer</span>`
          } else {
            document.querySelector('#reviewer').innerHTML = `Not claimed yet`
            document.querySelector('#reviewer-link').innerHTML = `Assign<span class="govuk-visually-hidden">2i reviewer</span>`
          }
        
        }

        if (status == "Fact check sent") {
          document.querySelector('#sent-out').innerHTML = `${sent_out}`
        }

        if (status == "Scheduled") {
          document.querySelector('#scheduled').innerHTML = `${scheduled}`
        }

        // Set send to 2i link

        if (currentPage == "content-item-edit" || currentPage == "content-item-history-and-notes") {
          if (status == "Draft" || status == "Amends needed") {
            document.querySelector('#send-to-2i').href = `content-item-2i?id=${id}&content-type=${format}&status=${status}`;
          }
        }

        // Set content item navigation links
        // document.querySelector('.moj-sub-navigation__list').innerHTML = `
        //   <li class="moj-sub-navigation__item"><a class="moj-sub-navigation__link" aria-current="page" href="content-item-edit?id=${id}&content-type=${format}&status=${status}">Edit</a></li>
        //   <li class="moj-sub-navigation__item"><a class="moj-sub-navigation__link" href="content-item-tagging?id=${id}&content-type=${format}&status=${status}">Tagging</a></li>`

      }

    });

  });
})