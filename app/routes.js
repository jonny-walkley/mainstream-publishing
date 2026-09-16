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

// Support app routes

router.post('/support-app/who-is-this-request-for', function (req, res) {
  res.render('support-app/what-are-you-requesting')
})

router.post('/support-app/what-are-you-requesting-answer', function (req, res) {

  var requestType = req.session.data['requestType']

  if (requestType == "new-account") {

    res.redirect('/support-app/which-apps-access-to')

  } else if (requestType == "completed-training") {

    res.redirect('/support-app/completed-training')

  } else if (requestType == "refresher-training") {

    res.redirect('/support-app/whitehall-publisher-training')

  }

})

router.post('/support-app/check-apps', function (req, res) {

  var apps = req.session.data['apps'] || []

  var whitehallSelected = apps.includes('whitehall')

  var specialistAppsSelected =
    apps.includes('manuals-publisher') ||
    apps.includes('specialist-publisher') ||
    apps.includes('travel-advice-publisher')

  if (whitehallSelected) {

    // Whitehall selected
    res.redirect('/support-app/whitehall-publisher-training')

  } else if (specialistAppsSelected) {

    // No Whitehall, but Manuals, Specialist or Travel Advice selected
    res.redirect('/support-app/writing-for-gov-uk-training')

  } else {

    // No Whitehall and no specialist apps
    res.redirect('/support-app/who-needs-a-copy-of-this-request')

  }

})

router.post('/support-app/whitehall-publisher-training-answer', function (req, res) {
  res.render('support-app/who-needs-a-copy-of-this-request')
})

router.post('/support-app/writing-for-gov-uk-training-answer', function (req, res) {
  res.render('support-app/who-needs-a-copy-of-this-request')
})

router.post('/support-app/who-needs-a-copy-of-this-request-answer', function (req, res) {
  res.render('support-app/check-answers')
})

router.post('/support-app/completed-training-answer', function (req, res) {
  res.render('support-app/who-needs-a-copy-of-this-request')
})