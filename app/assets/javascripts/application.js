//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//


function initialiseAutoComplete (autocompleteSelector) {
  let element = document.querySelector(autocompleteSelector)
  if(element) {

    accessibleAutocomplete.enhanceSelectElement({

    defaultValue: '',

    selectElement: element

  })
}
}

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here

  // Autocomplete selects

  // choose MP

  initialiseAutoComplete('#choose-mp');
  initialiseAutoComplete('#signatory-name');

})
