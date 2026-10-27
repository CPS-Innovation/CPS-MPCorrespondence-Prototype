//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//
import "./accessible-autocomplete.min.js";


function initialiseAutoComplete (autocompleteSelector) {
  let element = document.querySelector(autocompleteSelector)
  if(element) {

    accessibleAutocomplete.enhanceSelectElement({

    defaultValue: '',

    selectElement: element

  })

  let newInput = document.querySelector(autocompleteSelector)
  newInput.addEventListener('input', async (event ) => {
    console.log(event, newInput.value)
    await fetch(`/get-mp-data/${newInput.value}`)
  })
}
}

window.GOVUKPrototypeKit.documentReady(() => {

  initialiseAutoComplete('#choose-mp');
  initialiseAutoComplete('#signatory-name');

})
