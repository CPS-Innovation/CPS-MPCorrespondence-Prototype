
const CPSAreasList =  [
  "CPS Direct",
  "Cymru Wales",
  "East Midlands",
  "East of England",
  "London North",
  "London South",
  "Mersey Cheshire",
  "North East",
  "North West",
  "South East",
  "South West",
  "Thames and Chiltern",
  "Wessex",
  "West Midlands",
  "Yorkshire and Humber",
  "Communications Directorate",
  "Chief Finance Officer's Directorate (CFOD)",
  "Digital and Information Directorate",
  "Legal and Operational Delivery Directorate",
  "People Directorate",
  "Private Office",
  "Policy Directorate",
  "Transformation and Change Directorate",
  "SEOCID",
  "Special Crime and Counter Terrorism Division",
  "Organised Child Sexual Abuse Unit (OCSAU)",
  "Proceeds of Crime Division (POCD)"
].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0) );

var CPSAreasWithOptionsList = CPSAreasList.map(area =>({
    text: area,
    value: area
  }));


module.exports = {

  // Insert values here

  CPSAreas: CPSAreasList,
  CPSAreasWithOptions: CPSAreasWithOptionsList

}
