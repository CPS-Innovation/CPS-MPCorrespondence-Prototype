//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const  membersData = require('./data/members.json')
const  govukPrototypeKit  = require('govuk-prototype-kit') 

const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
// Logging session data 



 
router.use((req, res, next) => { 
    const log = { 
    /*method: req.method, 
    url: req.originalUrl, */
    data: req.session.data
    } 
    console.log(JSON.stringify(log, null, 2))
    res.locals.members = membersData
    next() 
    })


// Basic details routing

router.post('/create-new-record/basic-answer', function (req, res) {

    var isCMS = req.session.data['isCMS']
  
    // if IsCMS then send to get those details
    if (isCMS == "Yes"){
      res.redirect('/create-new-record/add-cms-details')
    } else {
      // else redirect to MP details
      res.redirect('/create-new-record/add-mp-details')
    }
  
  })


// /create-new-record/constituent-route


router.post('/create-new-record/constituent-route', function (req, res) {

    var isConst = req.session.data['isConstituent']
  
    // if isConst then send to get those details
    if (isConst == "Yes" || isConst == "yes"){
      res.redirect('/create-new-record/add-constituent')
    } else {
      // else redirect to letters
      res.redirect('/create-new-record/check-answers')
    }
  
  })



  router.post('/create-new-record/add-signatory-route', function (req, res) {

    var reqSign = req.session.data['requiresSignatory']
  
    // if needs signatory add it
    if (reqSign == "Yes" || reqSign == "yes"){
      res.redirect('/manage-letters/confirm-signatory')
    } else {
      // else redirect to letters
      res.redirect('/view-record/view?subNav=letters')
    }
  
  })

  router.post('/manage-letters/edit/draft-due-date-route', function (req, res) {

    var whatAction = req.session.data['whatAction-draft']
  
    // if for confirming
    if (whatAction == "confirm"){
      res.redirect('/manage-letters/edit/draft-due-date-confirm')
    } else {
      // else redirect to extension
      res.redirect('/manage-letters/edit/draft-due-date-extend')
    }
  
  })