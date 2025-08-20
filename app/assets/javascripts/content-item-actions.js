  window.GOVUKPrototypeKit.documentReady(() => {

  let params = new URLSearchParams(document.location.search);
  let contentItemID = params.get("id");

  fetch("/public/test.json").then(data => data.json()).then(data => {

    const thePath = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const currentPage = thePath.substring(thePath.lastIndexOf('/') + 1);

    data.forEach(({ title, assignee, state, format, version_number, id, scheduled, sent_out, reviewer, slug, important_note, meta_tag_description, language, lgsl_code, lgil_code, places_manager_service_identifier, body }, index) => {
      
      if (id == contentItemID) {

        let status = state.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()).replaceAll("_", " ")     

        // Set caption as publication title 
        document.querySelector('.govuk-caption-xl').innerHTML = `${title}`

        // Set cancel link to go back to the previous page

        const lastPageUrl = document.referrer;
        let backLinkPage = "content-item-";

        if (lastPageUrl.includes('edit')) {
          backLinkPage += `edit`
        } else if (lastPageUrl.includes('history-and-notes')) {
          backLinkPage += `history-and-notes`
        } else if (lastPageUrl.includes('admin')) {
          backLinkPage += `admin`
        } else {
          backLinkPage += `edit`
        }

        const cancelLink = document.querySelector('#cancel-link');

        if (cancelLink) {
          cancelLink.href = `${backLinkPage}?id=${id}&content-type=${format}&status=${status}`
        } else {
          document.querySelector('.govuk-back-link').href = `${backLinkPage}?id=${id}&content-type=${format}&status=${status}`
        }
        
        // --- Page-specifc ---

        switch (currentPage) {

          case "content-item-important-note":
              
            if (important_note) {
              document.querySelector('.govuk-heading-xl').innerHTML = "Update important note";
              document.querySelector('#important-note').value = important_note;
              document.querySelector('#important-note-button').innerHTML = "Update important note"
              document.querySelector('#delete-link').style.display = 'block';
            }
            
            break;

          case "content-item-compare-with-edition":
              
            document.querySelector('.govuk-heading-xl').innerHTML += ` ${version_number -1} to ${version_number}`;

            break;

          case "content-item-fact-check":

            // ---------- Display today's date ----------

            const today = new Date();

            // Options for formatting
            const options = { day: 'numeric', month: 'long', year: 'numeric' };

            // Format the date
            const formattedDate = today.toLocaleDateString('en-GB', options);

            // ---------- Display deadline date ----------

            function addWorkingDays(startDate, daysToAdd) {
                const result = new Date(startDate);
                let addedDays = 0;

                while (addedDays < daysToAdd) {
                    result.setDate(result.getDate() + 1);
                    const day = result.getDay();
                    // 0 = Sunday, 6 = Saturday
                    if (day !== 0 && day !== 6) {
                        addedDays++;
                    }
                }

                return result;
            }

            // Add 5 working days
            const futureDate = addWorkingDays(today, 5);

            // Format the date
            const formattedFutureDate = futureDate.toLocaleDateString('en-GB', options);
            
            const factCheckEmail = 
              `Hi,
              \rWe need you to check the factual accuracy of changes made to ‘${title}’ before it’s published on GOV.UK.
              \rThe GOV.UK Content Team made the changes because
              \r# Deadline: ${formattedFutureDate} (5 working days from today - ${formattedDate})
              \rPreview the changes: https://draft-origin.integration.publishing.service.gov.uk/example-url?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTVlMWI0ZS1iMDY4LTRkNDQtOWIxYi0zOWViMmRiNDM0NzkiLCJjb250ZW50X2lkIjoiZWYxMjA3ZjQtNGNlYy00NDQ4LTk4OGQtOTk3ZDc5NTc5M2FmIiwiaWF0IjoxNzU1NTk4NTk0LCJleHAiOjE3NTgyNzY5OTR9.vLoYkTEg4m_Cu81lm5xtwr2lSiBbltgm5ebcBmfyVN4
              \r---------------------------------------------------
              \r# What to do
              \rReply and confirm the content is correct.
              \rOr, if you spot something that's not correct, reply to this email and tell us:
              \r- which paragraph or section isn’t right - for example chapter 2, under heading ‘How much it costs’\r- what’s wrong and why - for example the text implies a legal obligation, when there isn't one
              \rCheck your reply is being sent to govuk-fact-check-integration@digital.cabinet-office.gov.uk.
              \rDo not remove [${id}] from the subject line - GDS will not get your fact check response if this is removed.
              \r---------------------------------------------------
              \r# How to do it
              \rWhen fact checking, please:
              \r- only point out factual errors - don’t suggest wording (GDS is responsible for the style)\r- use plain text - GDS systems don’t display text formatting, colours or attachments
              \rTo get the content published more quickly:
              \r- only include comments about sections that GDS has changed\r- only reply once - it’ll help if you co-ordinate your response before replying
              \r---------------------------------------------------
              \r# When to contact your GOV.UK lead
              \rAsk your GOV.UK lead if:
              \r- you’ve spotted a new issue - they’ll raise a new request with GDS\r- you’ve got any questions - they can ask GDS any queries via the Zendesk system\r- you need an extension to the deadline
              \rThank you.`;
            
            document.querySelector('#fact-check-email').value = factCheckEmail;

            break;

        }
        
      }

    });

  });
})