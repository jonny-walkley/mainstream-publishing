//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


router.post('/country-answer', function(request, response) {

    var breadcrumboptions = request.session.data['breadcrumboptions']
    if (breadcrumb-options == "choose breadcrumb"){
        response.redirect("/browse-breadcrumb-options")
    } else {
        response.redirect("/breadcrumb-confirmation")
    }
})

