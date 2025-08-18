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
        } else {
          backLinkPage += `history-and-notes`
        }

        document.querySelector('#cancel-link').href = `${backLinkPage}?id=${id}&content-type=${format}&status=${status}`
        
        // --- Page-specifc ---

        switch (currentPage) {

          case "content-item-important-note":
              
            if (important_note) {
              document.querySelector('.govuk-heading-xl').innerHTML = "Update important note";
              document.querySelector('#important-note').value = important_note;
              document.querySelector('#important-note-button').innerHTML = "Update important note"
            }
            
            break;

        }
        
      }

    });

  });
})