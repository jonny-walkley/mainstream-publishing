//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


router.post('/ur-1-pension-credit-breadcrumb-answer', function(request, response) {

    var breadcrumbchoice = request.session.data['breadcrumb-choice']
    if (breadcrumbchoice == "keep-tt"){
        response.redirect("/ur-1-pension-credit-tagging")
    } else {
        response.redirect("/ur-1-breadcrumb-selection")
    }
})

