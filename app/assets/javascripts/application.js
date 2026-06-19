//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here

  // Autocomplete select

  let selectElement = document.querySelector('#choose-mp')
 
  accessibleAutocomplete.enhanceSelectElement({

    defaultValue: '',

    selectElement: selectElement

  })

})
