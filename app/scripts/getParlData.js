import * as fs from 'node:fs';
import pLimit from 'p-limit';
import * as MembersJson from  '../data/members.json' with {type: 'json'};
import * as XMLMapping from 'xml-mapping';

const membersfile = 'app/data/members.json';
const overrideReset = false;

if (fs.existsSync(membersfile)) {
  const lastModified = new Date(fs.statSync(membersfile).mtime);
  const ResetDate = lastModified.setDate(lastModified.getDate + 7)
  if ((new Date() <= ResetDate) && overrideReset === false) {
    console.log('Using cached members');
    process.exit(0);
  }
}


async function getMPAddress(id) {
  const MPAddress = await fetch(`https://members-api.parliament.uk/api/Members/${id}/Contact`);
  const MPAddressJson = await MPAddress.json()
  MembersJson = MembersJson.map(item => {
    item.UKParliamentId == id ? item.address = MPAddressJson.value[0] : item.address = item.address
  })
}


async function getParlData(id=0, name="") {


    let dataHoC = [];

    const totalResultsRes = await fetch(`https://members-api.parliament.uk/api/Members/Search?IsCurrentMember=true&skip=0&take=1`)
    const totalResultsJson = await totalResultsRes.json()
    let totalResults = totalResultsJson.totalResults

    console.log(`Loading MP Data - total ${totalResults}`)

    const cLimit = pLimit(10);


    let cFetch;
    let fetchLim = name == "" ? totalResults : 1;
    let cPages = Math.ceil(totalResults/20)
    const cTake = 20;
    let cMemberId = 0;
    

    const getData = await Promise.all(
    Array.from({length: cPages}, (_, cFetch) =>
      cLimit(async () => {
        console.log(`Started fetch: ${cFetch} at ${new Date()}`)
        let APIURL;
        APIURL = `https://members-api.parliament.uk/api/Members/Search?IsCurrentMember=true&skip=${(cFetch*cTake)}&take=${cTake}`
        let res =  await fetch(APIURL);
        let data20 =  await res.json()
        /*let address =  await fetch(`https://members-api.parliament.uk/api/Members/${data20.items[0].value.id}/Contact`)
        let addressFetched = await address.json()*/

        dataHoC.push(data20.items.map((item) => {
          cMemberId++
          return {
            "memberId": cMemberId, 
            "UKParliamentId": item.value.id,
            "name": item.value.nameDisplayAs,
            "partyId": item.value.latestParty.id,
            "party": item.value.latestParty.name,
            "constituencyId": item.value.latestHouseMembership.house == 1 ? item.value.latestHouseMembership.membershipFromId : 0, // If House of Lords (house 2) don't return.
            "constituency": item.value.latestHouseMembership.house == 1 ? item.value.latestHouseMembership.membershipFrom : "",
            "constituencyType": "Constituency",
            "parliamentaryHouse": item.value.latestHouseMembership.house == 1 ? "House of Commons" : "House of Lords",
            "memberType" : item.value.latestHouseMembership.house == 1 ? "MP" : "Lord",
            "address" : {}
          }
        }))
      }
      )
    ));

    const getScottishParl = async () => {
      let ScottishParlData = await Promise.all(
        [
          fetch('https://data.parliament.scot/api/members'),
          fetch('https://data.parliament.scot/api/memberparties'),
          fetch('https://data.parliament.scot/api/parties'),
          fetch('https://data.parliament.scot/api/MemberElectionConstituencyStatuses'),
          fetch('https://data.parliament.scot/api/MemberElectionRegionStatuses'),
          fetch('https://data.parliament.scot/api/constituencies'),
          fetch('https://data.parliament.scot/api/regions'),
          fetch('https://data.parliament.scot/api/addresses')
        ]
      )

      let ScottishParlMembers = await ScottishParlData[0].json()
      let ScottishParlMemberParties = await ScottishParlData[1].json()
      let ScottishParlParties = await ScottishParlData[2].json()
      let ScottishParlMemberConstituencies = await ScottishParlData[3].json()
      let ScottishParlMemberRegions = await ScottishParlData[4].json()
      let ScottishParlConstituencies = await ScottishParlData[5].json()
      let ScottishParlRegions = await ScottishParlData[6].json()
      let ScottishParlAddresses = await ScottishParlData[7].json()

      dataHoC.push(ScottishParlMembers.filter((item) => {return item.IsCurrent == true}).map((item) => {
        
        let memberNameSplit = item.ParliamentaryName.split(",")
        let memberName = `${memberNameSplit[1]} ${memberNameSplit[0]}`.trim()

        let memberPartyJoin = ScottishParlMemberParties.filter(memberparty => memberparty.PersonID == item.PersonID)[0].PartyID;
        let memberParty = ScottishParlParties.filter(party => party.ID == memberPartyJoin)[0];
        let memberPartyId = memberParty.ID
        let memberPartyName = memberParty.ActualName

        let memberCId;
        let memberCName;
        let memberRId;
        let memberRName;

        let memberCJoinBase = ScottishParlMemberConstituencies.filter(memberc => { return memberc.PersonID == item.PersonID && memberc.ValidUntilDate === null});
        if(memberCJoinBase.length != 0) {
          let memberCJoin = memberCJoinBase[0].ConstituencyID
          let memberC = ScottishParlConstituencies.filter(conz => { return conz.ID == memberCJoin});
          memberCId = memberC.length != 0 ? memberC[0].ID : undefined;
          memberCName = memberC.length != 0 ?  memberC[0].Name  : undefined;
        }

        let memberRJoinBase = ScottishParlMemberRegions.filter(memberr => { return memberr.PersonID == item.PersonID  && memberr.ValidUntilDate === null});
        if(memberRJoinBase.length != 0) {
          let memberRJoin = memberRJoinBase[0].RegionID
          let memberR = ScottishParlRegions.filter(reg => { return reg.ID == memberRJoin });
          memberRId = memberR.length != 0 ? memberR[0].ID : undefined;
          memberRName = memberR.length != 0 ? memberR[0].Name : undefined;
        }

        let memberAddresses = ScottishParlAddresses.filter(address => { return address.PersonID == item.PersonID && address.AddressTypeId != 4})

        
        cMemberId++
          return {
            "memberId": cMemberId, 
            "ScottishParliamentId": item.PersonID,
            "name": memberName,
            "partyId": memberPartyId,
            "party": memberPartyName == "Scottish National Party" ? memberPartyName.trim() : memberPartyName.replace(/[p|P]arty/, "").trim(),
            "constituencyId": memberCId ? memberCId : memberRId, 
            "constituency": memberCName ? memberCName : memberRName,
            "constituencyType": memberCId ? "Constituency" : "Region",
            "parliamentaryHouse": "Scottish Parliament",
            "memberType" : "MSP",
            "address" : [...memberAddresses.map(bAddress => { 

              let bAddressDescription;

              switch (bAddress.AddressTypeID) {
                case 1:
                  bAddressDescription = "Parliamentary address";
                case 2:
                  bAddressDescription = memberCId ? "Constituency" : "Region" + " address";
                case 3:
                  bAddressDescription = "Ministerial address"
                default:
                  bAddressDescription = "Parliamentary address"
              }
              
              return {
              "addressDescription": bAddressDescription,
              "line1": bAddress.Line1,
              "line2": bAddress.Line2,
              "town": bAddress.Town,
              "county": bAddress.Region,
              "postcode": bAddress.PostCode,
              "phoneNumber":"",
              "email":""            
            }})]
          }

      }))


    }

    const getWelshSenedd = async () => {
      let welshseneddData =  await (await fetch("https://business.senedd.wales/mgwebservice.asmx/GetCouncillorsByWard")).text();
      let welshseneddMembers =  await XMLMapping.load(welshseneddData)
      let welshseneddWards = welshseneddMembers.councillorsbyward.wards.ward

      for (let ward of welshseneddWards) {

        console.log("Started fetch (Welsh Senedd) for "+ward.wardtitle[0])

        dataHoC.push(ward.councillors.councillor.map((item) => {
          cMemberId++
          console.log(item.workaddress)
          return {
            "memberId": cMemberId, 
            "WelshSeneddId": Number(item.councillorid['$t']),
            "name": item.fullusername['$t'].replace("MS", "").trim(),
            "partyId": 0,
            "party": item.politicalpartytitle['$t'].replace(/[p|P]arty/, "").trim(),
            "constituencyId": 0,
            "constituency": ward.wardtitle['$t'],
            "constituencyType": "Constituency",
            "parliamentaryHouse": "Welsh Parliament/Senedd",
            "memberType" : "MS",
            "address" : [{
              "addressDescription": "Parliamentary address",
              "line1": item.workaddress.line1['$t'],
              "line2": item.workaddress.line2['$t'],
              "town": item.workaddress.line3['$t'],
              "county": "",
              "postcode": item.workaddress.postcode['$t'],
              "phoneNumber":item.workaddress.phone ? item.workaddress.phone['$t'] : "",
              "email":item.workaddress.email ? item.workaddress.email['$t'] : ""       
            }]
          }
        }))
      }
    }

    await getWelshSenedd()
    await getScottishParl()



    return dataHoC.flat()
  
  }

const contentDataHoC = JSON.stringify(await getParlData(), null, 2)

fs.writeFile('app/data/members.json', contentDataHoC, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
})