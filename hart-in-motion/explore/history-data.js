// Final landmark copy supplied by Simple Minds Studios, October 22, 2026.
const brochure='https://cityofhart.org/documents/2019_Brochure_UDPUK.pdf';
const plan='https://paperzz.com/doc/8444464/rec-plan---city-of-hart';
const museum='https://www.harthistoricdistrict.com/';
const card=(text,source)=>({text,source});
export const items={
  depot:{title:'Hart Railroad Depot',meta:'Preservation story',question:'What other familiar Hart building deserves a second chapter?',tabs:{
    then:card('In 2007, the Hart railroad depot was moved to the Historic District to prevent demolition.',plan),
    detail:card('Notice the deep roof overhang, wooden support brackets, and distinctive freight doors in the photographic study.',brochure),
    now:card('The depot remains part of the district’s architectural collection. Access and programming may be affected while the Historic District is being reimagined.',museum)
  }},
  caboose:{title:'Glover Railroad Caboose',meta:'1926 · Railroad heritage',question:'Would you rather see the cupola up close or explore the interior someday?',tabs:{
    then:card('The district’s historic brochure identifies the red Glover Railroad Caboose as a 1926 artifact.',brochure),
    detail:card('Find the raised cupola, yellow handrails, and black undercarriage in the model.',brochure),
    now:card('The caboose remains one of the district’s recognizable railroad pieces. Its inclusion here does not guarantee visitor access during the closure period.',museum)
  }},
  heritage:{title:'Heritage Hall',meta:'Community place',question:'Which feature caught your eye first: the lanterns, the porch, or the rafters?',tabs:{
    then:card('Heritage Hall appears in the district’s historic brochure under 2002 — a reminder that a historic place can keep growing while still honoring the past.',brochure),
    detail:card('Watch the rhythm of porch posts, exposed rafters, and hanging lanterns.',brochure),
    now:card('Heritage Hall is described as a gathering space with a covered patio. Current use or rentals should be confirmed separately.',museum)
  }},
  fishery:{title:'Old Fishery · Surviving Portion',meta:'Documented remnant · Date not verified',question:'Do you remember what this building looked like before?',tabs:{
    then:card('The Historic District sits in a former business and industrial area near Chippewa Creek. Local records point to historic processing and mill structures nearby, but not to a verified construction date for this specific fragment.',plan),
    detail:card('Look for the orange brick, open basement bays, and broken timber. The render preserves the missing sections rather than imagining a complete restoration.',brochure),
    now:card('This is a record of what remains — and an invitation for residents to share archival photos or firsthand memories that could help clarify its story.',museum)
  }}
};
