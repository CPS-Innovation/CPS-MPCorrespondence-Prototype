
function ParlAPIRequest(searchTerm) { 
        return new Request(`https://members-api.parliament.uk/api/Members/Search?take=5&Name=${searchTerm}`)
    };


async function getMPData(apiRequest) {

let mpData;

await fetch(apiRequest ? apiRequest : ParlAPIRequest("")).then((response)=> {
  if (!response.ok) {
    throw new Error(`MP Data could not be loaded ${response.status}`);
  }

  return response.json()
}).then((data) => {
  mpData =  data
});


return mpData
}

module.exports = {
  getMPData,
  ParlAPIRequest
}