//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// Log previous page, current page and session data

// router.use('/', (req, res, next) => {
//     const lastItem = req.get('Referrer').substring(req.get('Referrer').lastIndexOf('/') + 1);
//     const log = {
//         previous_page: "/" + lastItem,
//         current_page: req.url,
//         data: req.session.data
//     }
//     console.log("========== START ==========");
//     console.log(JSON.stringify(log, null, 2));
//     console.log("========== END ==========");
//     console.log("                           ");
//     console.log("                           ");
//     console.log("                           ");
//     next();
// });

router.use((req, res, next) => {
    const log = {
        data: req.session.data
    }
    console.log(JSON.stringify(log, null, 2));
    next();
})

router.post('/ur-1-pension-credit-breadcrumb-answer', function(request, response) {

    var breadcrumbchoice = request.session.data['breadcrumb-choice']
    if (breadcrumbchoice == "keep-tt"){
        response.redirect("/ur-1-pension-credit-tagging")
    } else {
        response.redirect("/ur-1-breadcrumb-selection")
    }
})