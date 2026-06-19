//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
// Logging session data 

const mp_data = require('./data/mps.json')


 
router.use((req, res, next) => { 
    const log = { 
    method: req.method, 
    url: req.originalUrl, 
    data: req.session.data 
    } 
    console.log(JSON.stringify(log, null, 2))
    res.locals.mps = mp_data
   
    next() 
    })
// Basic details routing
router.post('/create-new-record/basic-answer', function (req, res) {

    var isCMS = req.session.data['isCMS']
  
    // if IsCMS then send to get those details
    if (isCMS == "yes"){
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
    if (isConst == "yes"){
      res.redirect('/create-new-record/add-constituent')
    } else {
      // else redirect to letters
      res.redirect('/create-new-record/check-answers')
    }
  
  })
