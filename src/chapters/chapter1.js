/* ================= CHAPTER 1: THE VOICE — PHASE 1: MERCY (FEATURE-LOCKED) =================
   Flow: prologueFinal -> mercyTitle -> create() ... begin() -> hankRepair
         -> mercyHub -> (workshop|clinic|water, any order) -> ruthCrisis -> mercyDay
         -> (dayJosh|dayMara|dayRuth|dayEli, any order) -> departure -> departureArgument
         -> departurePhone -> phase1Done
   The legacy road loop (road/travel/scavenge/etc.) was retired in Milestone 1.
   Do not modify prose, choices, pacing, characterization, or canon here. */


function mercyTitle(){document.body.classList.add('cinema');screen(`<div class="cine-art">${img('bg-mercy.webp','bg kenburns','Mercy, Texas')}<div class="shade"></div><div class="dust"></div><div class="cine-title"><div><div class="eyebrow">60 YEARS LATER</div><h2>MERCY, TEXAS</h2><p>POPULATION: 186</p></div></div></div><div class="cine-controls">${btn('CONTINUE','create()','primary')}</div>`)}



function hankRepair(){g.phase='hank_repair';save();document.body.classList.remove('cinema');const n=npcState('hank');n.met=true;
const isF=g.sex==='Female';
const routeBeat=isF
?`<p>Something is wrong with the seating — not the housing. You lean in close, and there it is: the alignment pin sheared clean through. Everyone has been fighting the housing. The housing was never the problem.</p><p><b>Josh:</b> “Well. Forty-nine years old and getting schooled.” A beat. “You’ve got eyes, I’ll give you that.”</p>`
:`<p>The housing is seized solid, rust welded to rust. Josh watches you take the strain.</p><p><b>Josh:</b> “Easy — give her some of that Mercer persuasion. Easy now…”</p><p>The housing breaks free with a crack like a knuckle popping.</p><p><b>Josh:</b> “Remind me never to arm-wrestle you.”</p>`;
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div><p>The workshop yard smells of hot metal and old oil. Josh Rourke has the north pump’s housing cracked open on the bench, and he’s looking at you like you’re the only spare pair of hands in Mercy.</p><p><b>Josh:</b> “There you are. Hold this steady — steady, not strangled. It’s a pump housing, not a raider.”</p>${routeBeat}<p><b>Josh:</b> “Hand me my tire iron — the old one.”</p><p>The iron is worn smooth as river stone from decades of hands. It has gotten Josh Rourke out of more trouble than he will ever admit.</p><p><b>Josh:</b> “Center bolt now. Nice and easy…”</p><p><b>Josh:</b> “Strip that bolt and I’m making you explain it to Ruth.”</p>${btn('“Wouldn’t dream of it.”','hankRepairChoice(0)','choice')}${btn('“When have I ever stripped a bolt?”','hankRepairChoice(1)','choice')}</div>`)}



function hankRepairChoice(n){
const reply=n===0
?`<p><b>Josh:</b> “Good answer. Ruth scares me worse than raiders, and I’ve met raiders.”</p>`
:`<p><b>Josh:</b> “Tuesday.”</p><p><b>You:</b> “That was a screw.”</p><p><b>Josh:</b> “It had threads. It counts.”</p>`;
if(n===0){noteTreatment('hank','repair_careful');}
g.flags.tireIronSeen=true;save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div>${reply}<p>The bolt turns. The pump seats true.</p><p>His hands tremble faintly at rest — you catch it when he sets the wrench down. The moment he takes up a tool again, they go still as stone.</p><p><b>Josh:</b> “You've been taking things apart since I got here. I used to find my wrenches in the dirt behind your house.”</p><p><b>Josh:</b> “Ruth’s been asking after you. Go on — Mara’s short-handed at the clinic, and Eli’s probably flooded the water station by now. Be useful somewhere.”</p>${btn('“Your hands were shaking.”','hankHandsFollow()','choice')}${btn('HEAD INTO MERCY','mercyHub()','primary')}</div>`)}



function mercyBlurb(kind){const k='blurb_'+kind;const n=(g.flags[k]=(g.flags[k]||0)+1);
const pools={day1:[
"<p>Mercy isn’t much to look at, and the people here will tell you so with pride. Patchwork walls. Salvaged everything. Gardens growing in old tires. A hundred and eighty-six people who have kept each other alive for sixty years.</p>",
"<p>Mercy goes about its morning — the workshop humming, the clinic smelling of soap, the water station coughing along.</p>",
"<p>Someone’s mending a fence. Someone’s laughing. A pump coughs in the distance. Mercy keeps being Mercy.</p>"],day2:[
"<p>Mercy is packing, in its way. Supplies change hands in doorways. Nobody says goodbye out loud yet.</p>",
"<p>The truck sits ready in the yard. People find reasons to walk past it.</p>",
"<p>Goodbyes happen sideways here — an extra portion pressed into your hands, a tool oiled and returned.</p>",
"<p>The light slants lower. Whatever the day held, it’s nearly spent.</p>"]};
const pool=pools[kind];return pool[Math.min(n-1,pool.length-1)];}



function mercyHub(){g.phase='mercy_hub';if(!g.flags.mercyExplore)g.flags.mercyExplore={workshop:false,clinic:false,water:false};const s=settleState('mercy');s.visited=true;save();
const ex=g.flags.mercyExplore;
const b=(key,label,fn)=>ex[key]?`<p class="muted">✓ ${label} — visited</p>`:btn(label,fn+'()','choice');
const done=ex.workshop&&ex.clinic&&ex.water;
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="eyebrow">DAY 1</div><h2>MERCY, TEXAS</h2>${mercyBlurb('day1')}<p class="muted">Ruth wants to see you. But first, Mercy is yours to walk.</p>${b('workshop','WORKSHOP — Josh Rourke','mercyWorkshop')}${b('clinic','CLINIC — Mara Velez','mercyClinic')}${b('water','WATER STATION — Eli Boone','mercyWater')}${done?`<hr>${btn('RUTH CALDER — the council table','ruthCrisis()','primary')}`:`<p class="muted">Check in around Mercy first. Ruth can wait a little.</p>`}</div>`)}



function mercyWorkshop(){g.phase='mercy_workshop';if(!g.flags.mercyExplore)g.flags.mercyExplore={workshop:false,clinic:false,water:false};g.flags.mercyExplore.workshop=true;const n=npcState('hank');n.met=true;save();
const isF=g.sex==='Female';
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div><div class="eyebrow">THE WORKSHOP</div><p>The drill press is older than the Collapse. Half the tools on the wall are too. Everything in here has been repaired, re-repaired, and repaired again — and somehow it all still works.</p><p>Josh is truing a warped flange, tongue caught between his teeth in concentration.</p><p><b>Josh:</b> “Back again? You miss me, or are you avoiding Ruth?”</p>${btn('“Put me to work.”','mercyWorkshopHelp()','choice')}${btn('“How old is that drill press?”','mercyWorkshopAge()','choice')}</div>`)}



function mercyWorkshopHelp(){noteTreatment('hank','helped_workshop');save();const isF=g.sex==='Female';
const beat=isF?`<p>You sort his fastener chaos by logic only you can see. Twenty minutes later he’s working twice as fast.</p><p><b>Josh:</b> “There’s the brains of the operation.”</p>`:`<p>You haul the flange stock where he needs it without being asked. He doesn’t thank you — he just nods, which from Josh is a speech.</p><p><b>Josh:</b> “There’s the muscle of the operation.”</p>`;
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div>${beat}<p><b>Josh:</b> “Go on. You’ve got people to see.”</p>${btn('BACK TO MERCY','mercyHub()','primary')}</div>`)}



function mercyWorkshopAge(){screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div><p><b>Josh:</b> “Older than me. Don’t tell it that — it’s sensitive.”</p><p>He pats the machine like an old dog.</p><p><b>Josh:</b> “Go on. You’ve got people to see.”</p>${btn('BACK TO MERCY','mercyHub()','primary')}</div>`)}



function hankHandsFollow(){screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div><p>Josh looks at his hands like they belong to somebody else.</p><p><b>Josh:</b> “They do that sometimes.”</p><p><b>You:</b> “Then how—”</p><p><b>Josh:</b> “Hands shake. Tools don’t. Figured out the difference a while back.”</p><p>He picks up the wrench — steady as stone.</p><p><b>Josh:</b> “Don’t worry. I only drop things I’ve already fixed.”</p>${btn('HEAD INTO MERCY','mercyHub()','primary')}</div>`)}



function mercyClinic(){g.phase='mercy_clinic';if(!g.flags.mercyExplore)g.flags.mercyExplore={workshop:false,clinic:false,water:false};g.flags.mercyExplore.clinic=true;const n=npcState('mara');n.met=true;save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-mara.webp')}<div><b>Mara</b><br><small class="muted">Mercy medic</small></div></div><div class="eyebrow">THE CLINIC</div><p>The clinic smells of boiled water and soap. The shelves are honest: half-empty, everything counted.</p><p>Mara is wrapping a split lip for a boy who is trying very hard not to cry.</p><p><b>Mara:</b> “Hold still. It’s a split lip, not a war wound.”</p><p>To you, without looking up: “You’re Ruth’s errand-runner today?”</p>${btn('“Put me to work.”','mercyClinicHelp()','choice')}${btn('“How bad is it, honestly?”','mercyClinicHonest()','choice')}</div>`)}



function mercyClinicHelp(){noteTreatment('mara','helped_clinic');save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-mara.webp')}<div><b>Mara</b><br><small class="muted">Mercy medic</small></div></div><p>She sets you to sorting sterilized bandages. The boiled ones go left. Her thumb brushes a small worn notebook in her pocket — then she’s back to work, and you don’t ask.</p><p><b>Mara:</b> “…Thank you.”</p><p>It costs her something to say it. That’s how you know she means it.</p>${btn('“What’s in the notebook?”','maraNotebookFollow()','choice')}${btn('BACK TO MERCY','mercyHub()','primary')}</div>`)}



function mercyClinicHonest(){screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-mara.webp')}<div><b>Mara</b><br><small class="muted">Mercy medic</small></div></div><p><b>Mara:</b> “Bad enough I’m washing bandages. Don’t quote me.”</p><p>She doesn’t dress it up. That’s Mara — she never lies about the odds, even when the truth is thin comfort.</p><p><b>Mara:</b> “Go on. Ruth’s waiting, and I’ve got a waiting room.”</p>${btn('BACK TO MERCY','mercyHub()','primary')}</div>`)}



function maraNotebookFollow(){screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-mara.webp')}<div><b>Mara</b><br><small class="muted">Mercy medic</small></div></div><p>She hesitates — then pulls it out. It isn’t medical. Page after page of copied routes, half-finished maps, a traveler’s warning in somebody else’s hand.</p><p><b>Mara:</b> “My wall started in here. Before I had a wall.” She tucks it away, a little embarrassed. “Don’t tell Ruth I take it on rounds. She thinks I’ll lose it.”</p>${btn('BACK TO MERCY','mercyHub()','primary')}</div>`)}



function mercyWater(){g.phase='mercy_water';if(!g.flags.mercyExplore)g.flags.mercyExplore={workshop:false,clinic:false,water:false};g.flags.mercyExplore.water=true;const n=npcState('eli');n.met=true;save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-eli.webp')}<div><b>Eli</b><br><small class="muted">Water station</small></div></div><div class="eyebrow">THE WATER STATION</div><p>The water station hums wrong — you hear it before you see it. Eli Boone is waist-deep in a bypass trench, soaked to the elbows and cheerful as a man half-drowned.</p><p><b>Eli:</b> “Don’t mind the lake. The lake is load-bearing.”</p><p>The pressure gauge barely trembles. The north pump is dying and everybody knows it. Eli is just negotiating the terms.</p><p><b>Eli:</b> “Josh says if we ever go east, it’s through mountains. Real ones.”</p><p><b>You:</b> “You’ve never seen a mountain, Eli.”</p><p><b>Eli:</b> “I’ve seen a picture! …Mostly sky. But I’m told they’re very mountainous.”</p>${btn('“Hand me a wrench.”','mercyWaterHelp()','choice')}${btn('“The mountains can wait, Eli.”','mercyWaterTease()','choice')}</div>`)}



function mercyWaterHelp(){noteTreatment('eli','helped_water_station');save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-eli.webp')}<div><b>Eli</b><br><small class="muted">Water station</small></div></div><p>You hold the line while he seats the bypass. Water stutters, catches, flows — thin but steady.</p><p><b>Eli:</b> “Ha! Take that, entropy.”</p><p>He’s grinning like he just won something. Maybe he did.</p>${btn('BACK TO MERCY','mercyHub()','primary')}</div>`)}



function mercyWaterTease(){screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-eli.webp')}<div><b>Eli</b><br><small class="muted">Water station</small></div></div><p><b>Eli:</b> “Rude. Accurate, but rude.”</p><p>He goes back to his trench, still smiling.</p>${btn('BACK TO MERCY','mercyHub()','primary')}</div>`)}



function ruthCrisis(){g.phase='ruth_crisis';const n=npcState('ruth');n.met=true;save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-ruth.webp')}<div><b>Ruth</b><br><small class="muted">Mercy council leader</small></div></div><div class="eyebrow">THE COUNCIL TABLE</div><p>Ruth Calder’s table is covered in paper — tallies, estimates, lists with things crossed out. She looks up like she’s been expecting you for an hour.</p><p><b>Ruth:</b> “Sit. I won’t waste your time, so don’t waste mine.”</p><p><b>Ruth:</b> “The north pump is dying. Eli’s patches are buying weeks, not seasons.”</p><p><b>Ruth:</b> “Mara’s down to scraps and stubbornness.”</p><p><b>Ruth:</b> “The stores are thinner than the council admits in public.”</p><p><b>Ruth:</b> “Nineteen days. That’s honest counting, not council counting.”</p><p><b>Ruth:</b> “Understand me: nineteen days is not a deadline. Nobody drops dead on day twenty. It’s the day after which we cannot keep a hundred and eighty-six people fed and watered the way we are now — not without choosing who eats. And I will not choose. Not quietly. Not ever.”</p><p>She folds her hands. For a moment she just looks tired — sixty years of decisions where every option hurt somebody.</p><p><b>Ruth:</b> “I know what’s pulling at you. I won’t pretend I don’t understand it.”</p>${btn('“Then we buy more time.”','ruthCrisisChoice(0)','choice')}${btn('“What do you need from me?”','ruthCrisisChoice(1)','choice')}${btn('[Say nothing.]','ruthCrisisChoice(2)','choice')}</div>`)}



function ruthCrisisChoice(n){
const replies=[
`<p><b>Ruth:</b> “Good. Because hoping is not a plan, and I’m done with hoping.”</p>`,
`<p><b>Ruth:</b> “Right now? Eyes open and mouth shut. Walk Mercy. See it the way I have to see it.”</p>`,
`<p>She studies you for a long moment — then nods, once. Some things don’t need saying.</p>`];
noteTreatment('ruth',['crisis_resolve','crisis_practical','crisis_silent'][n]);save();
recordConsequence('settlement','Ruth’s nineteen days','Ruth laid out Mercy’s failing pumps, medicine, and food. Nineteen days of sustainable support — not a deadline, but the end of easy choices.',{ref:'mercy'});
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-ruth.webp')}<div><b>Ruth</b><br><small class="muted">Mercy council leader</small></div></div>${replies[n]}<p><b>Ruth:</b> “Go home. Rest. Tomorrow we start figuring out what nineteen days can buy.”</p>${btn('LEAVE THE COUNCIL TABLE','mercyDay()','primary')}</div>`)}



function mercyDay(){g.phase='mercy_day';g.day=2;if(!g.flags.mercyDay)g.flags.mercyDay={josh:false,mara:false,ruth:false,eli:false};save();
const d=g.flags.mercyDay;
const b=(key,label,fn)=>d[key]?`<p class="muted">✓ ${label}</p>`:btn(label,fn+'()','choice');
const done=d.josh&&d.mara&&d.ruth&&d.eli;
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="eyebrow">DAY 2</div><h2>ONE DAY IN MERCY</h2><p>Ruth's word at the council table: one day to prepare. Say your goodbyes. Settle your debts. Check the truck. The road to Colorado won't wait past dawn.</p>${mercyBlurb('day2')}<p class="muted">Four people. One day. Spend it how you choose.</p>${b('josh','THE WORKSHOP — help Josh ready the truck','dayJosh')}${b('mara',"MARA'S ROOM — the map wall",'dayMara')}${b('ruth',"RUTH'S HOUSE — before you go",'dayRuth')}${b('eli','FIND ELI — the dead phone','dayEli')}${done?`<hr><p>The light is going. Time.</p>${btn('DUSK — gather at the truck','departure()','primary')}`:`<p class="muted">The day is yours. There'll be time for all of them.</p>`}</div>`)}



function dayJosh(){g.phase='day_josh';g.flags.mercyDay.josh=true;save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div><div class="eyebrow">THE WORKSHOP — MORNING</div><p>The truck is up on blocks and Josh is underneath it, arguing with a leaf spring. "Hand me the — no. The other one. The one that isn't rusted to hell."</p><p>You work beside him through the morning. He talks the whole time — the truck, Mara's terrible coffee, the pump house roof — about everything except the road ahead. It's the most comfortable you've felt in weeks, and it isn't even quiet.</p><p>At midday he unrolls his Old Road Atlas across the hood to check the route north. Inside the back cover, in faded ink: eleven tally notches. Four of them circled.</p><p>He sees you looking.</p>${btn('\u201cEleven notches. Four circled.\u201d','dayJoshChoice(0)','choice')}${btn('Say nothing. Hand him the wrench.','dayJoshChoice(1)','choice')}</div>`)}



function dayJoshChoice(n){const asked=n===0;noteTreatment('hank','saw_the_notches');noteTreatment('hank',asked?'pressed_about_past':'let_it_lie');save();
const reply=asked?`<p>Something crosses his face and is gone. "Eleven of us left the flats, twenty years back. Four got here." He folds the atlas with too much care. "I made a call, out there. People died." A beat. "That's the whole story you're getting today."</p><p>It isn't unkind. That's what makes it land harder.</p>`:`<p>You hand him the wrench. He takes it, and something in his shoulders eases — gratitude, that you didn't ask. "Smart," he says. "Some boxes you don't open on a workday."</p>`;
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div>${reply}<p>Later, tracing the route with one greasy finger, he stops over a marked corridor — I-40. His finger doesn't move for a long moment.</p><p>"Places like this," he says quietly. "We lost people in country like this."</p><p>He rolls the atlas up. "Truck'll make it. Probably. Don't quote me."</p><p>"Not that I'm going anywhere," he adds. "Done with roads."</p>${btn('BACK TO MERCY','mercyDay()','primary')}</div>`)}



function dayMara(){g.phase='day_mara';g.flags.mercyDay.mara=true;save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-mara.webp')}<div><b>Mara</b><br><small class="muted">Mercy medic</small></div></div><div class="eyebrow">MARA'S ROOM — MIDDAY</div><p>One wall of Mara's room is maps. Not one map — dozens, layered and overlapping: a pre-collapse highway atlas with pages soft from handling, hand-copied sheets in three different inks, Mercy supply records with routes penciled in the margins, a traveler's warning copied and recopied until the original hand is gone.</p><p>"My wall," she says, a little shy and a little proud. "Everybody brings me maps."</p><p>She finds Colorado with her finger like she's done it a thousand times. A route north, traced and retraced. "I know it on paper," she says. "Every mile."</p><p>Then, fast, like she's been holding it in: "I want to go." A breath. "Not just because you need someone who knows the way — though you do. I've spent my whole life learning the world on paper." She looks at her wall. "I want to see it for real."</p>${btn('\u201cI\u2019d be glad to have you.\u201d','dayMaraChoice(0)','choice')}${btn('\u201cIt\u2019s a hard road, Mara.\u201d','dayMaraChoice(1)','choice')}${btn('\u201cThat\u2019s Ruth\u2019s call, not mine.\u201d','dayMaraChoice(2)','choice')}</div>`)}



function dayMaraChoice(n){noteTreatment('mara','saw_map_wall');noteTreatment('mara','asked_to_come');noteTreatment('mara',['welcomed_mara','hesitated_mara','deferred_to_ruth'][n]);save();
const replies=[`<p>"Then it's settled," she says, grinning. "I'll pack the good bandages."</p>`,`<p>She nods, serious. "I know. That's why you need someone who knows the way on paper."</p>`,`<p>"Fair," she says. "But I'm asking you first."</p>`];
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-mara.webp')}<div><b>Mara</b><br><small class="muted">Mercy medic</small></div></div>${replies[n]}<p>She pulls down a composite sheet — her own work, stitching five sources together. Across it, in different hands from different years, the same stretch of I-40 is marked: a red line here, a skull scratched there, a note in faded pencil — <i>don't</i>. A Mercy record from eleven years back. A traveler's warning from four.</p><p>"Different people," Mara says. "Different years. Same road." She looks at you. "Nobody knows why."</p><p>"You'd cross all that for ${g.spouseName}?" she asks quietly. "Then somebody should know the way for real."</p>${btn('"Has anyone tried to find out why?"','maraWhyFollow()','choice')}${btn('BACK TO MERCY','mercyDay()','primary')}</div>`)}



function maraWhyFollow(){screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-mara.webp')}<div><b>Mara</b><br><small class="muted">Mercy medic</small></div></div><p>“A few.” She doesn’t elaborate for a moment. “Ruth forbade the last one. Said Mercy couldn’t afford to lose people to curiosity.”</p><p>A pause. “They went anyway. They didn’t come back.”</p>${btn('BACK TO MERCY','mercyDay()','primary')}</div>`)}



function dayRuth(){g.phase='day_ruth';g.flags.mercyDay.ruth=true;save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-ruth.webp')}<div><b>Ruth</b><br><small class="muted">Mercy council leader</small></div></div><div class="eyebrow">RUTH'S HOUSE — AFTERNOON</div><p>Ruth's house smells of tea and lamp oil. The walls hold photographs that don't belong to this world: a beach crowded with people, a city street at dusk, a birthday cake with too many candles. She doesn't explain them. They're just her walls.</p><p>On the table, a book bound in salvaged leather. Page after page of names, in handwriting that changes as the decades pass. Sixty years of them.</p><p>"Somebody should write them down," Ruth says, when she catches you looking. She doesn't elaborate. She doesn't need to.</p><p>Her old radio sits silent in the corner. "Play the broadcast again in your head," she says suddenly. "The way it comes around again — the same words, the same spaces between them." Her hands tighten on her cup. "I've heard that cadence before."</p><p>She will not say more. Not yet.</p>${btn('\u201cWho did you lose, Ruth?\u201d','dayRuthChoice(0)','choice')}${btn('\u201cWhat is it about the cadence?\u201d','dayRuthChoice(1)','choice')}${btn('Sit with her a while. Say nothing.','dayRuthChoice(2)','choice')}</div>`)}



function dayRuthChoice(n){noteTreatment('ruth','saw_memorial');noteTreatment('ruth','heard_cadence');noteTreatment('ruth',['asked_about_sister','asked_about_cadence','sat_quietly'][n]);save();
const replies=[`<p>"My sister." Ruth looks at the photographs for a long moment. "I did things I'm not proud of, trying to keep her alive. We all did things." A pause. "She died anyway."</p><p>She pours more tea with steady hands. "Find them," she says. "I mean that. But find something for Mercy too. Come back."</p>`,`<p>"No." Ruth says it gently, which somehow makes it final. "Some things I'll carry a while longer." She studies you. "You watch the road the way I used to watch the horizon. That's enough for today."</p>`,`<p>You sit. The lamp ticks. Somewhere outside, someone is laughing, and a pump is coughing, and Mercy keeps being Mercy.</p><p>After a while Ruth nods, once. Some things don't need saying.</p>`];
let vow='';
if(n===0){const tr=(npcState('ruth').treatment||[]);if(tr.indexOf('vowed_for_mercy')<0&&tr.indexOf('would_not_vow_for_mercy')<0){vow=`<hr><p class="muted">Her words hang in the lamplight.</p>${btn('“I will. For Mercy too.”','dayRuthVow(0)','choice')}${btn('“I can’t promise that.”','dayRuthVow(1)','choice')}`;}}
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-ruth.webp')}<div><b>Ruth</b><br><small class="muted">Mercy council leader</small></div></div>${replies[n]}${vow}${btn('BACK TO MERCY','mercyDay()','primary')}</div>`)}



function dayRuthVow(n){const tr=(npcState('ruth').treatment||[]);if(tr.indexOf('vowed_for_mercy')>=0||tr.indexOf('would_not_vow_for_mercy')>=0){mercyDay();return;}
noteTreatment('ruth',n===0?'vowed_for_mercy':'would_not_vow_for_mercy');save();
const reply=n===0?`<p>She studies you for a long moment. Then she nods — once, the way she does when something is decided.</p><p><b>Ruth:</b> “Then Mercy will remember that. So will I.”</p>`:`<p>Something in her face eases — not disappointment. Respect.</p><p><b>Ruth:</b> “Good. Promises shouldn’t come cheap.”</p>`;
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-ruth.webp')}<div><b>Ruth</b><br><small class="muted">Mercy council leader</small></div></div>${reply}${btn('BACK TO MERCY','mercyDay()','primary')}</div>`)}



function dayEli(){g.phase='day_eli';g.flags.mercyDay.eli=true;save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-eli.webp')}<div><b>Eli</b><br><small class="muted">Mercy kid</small></div></div><div class="eyebrow">THE WORKSHOP YARD — LATE AFTERNOON</div><p>Eli is trailing Josh around the yard holding a dead cell phone like a holy relic. "You didn't try the contacts this time." "I tried the contacts fourteen times." "Maybe fifteen's the one."</p><p>Josh catches your eye over the kid's head: <i>help me</i>.</p><p>When Josh finally escapes to the pump house, Eli turns the phone over in his hands and goes quieter. "Ruth says phones could keep voices. Pictures. Messages." A pause. "I'm forgetting what he sounded like. My dad."</p><p>"But listen —" Eli leans in, suddenly all business. "The broadcast? It does the same part every time. Exactly the same words, exactly the same spaces. I counted." He taps the dead phone. "I know about repeating things."</p><p>It's an observation. It's also the sharpest thing anyone's said about the Voice all day.</p><p>"I'm coming with you," Eli says. "Don't tell Josh I said. I'm coming."</p>${btn('\u201cWe\u2019ll see, Eli.\u201d','dayEliChoice(0)','choice')}${btn('\u201cIt\u2019s too dangerous. You know that.\u201d','dayEliChoice(1)','choice')}${btn('\u201cTalk to Josh about it.\u201d','dayEliChoice(2)','choice')}</div>`)}



function dayEliChoice(n){noteTreatment('eli','phone_moment');noteTreatment('eli','marked_the_pattern');noteTreatment('eli','eli_begged');noteTreatment('eli',['was_gentle','was_firm','deferred_to_josh'][n]);save();
const replies=[`<p>"'We'll see' is what grown-ups say when they mean no," Eli says, but he's grinning a little.</p>`,`<p>"Everything's dangerous," Eli mutters. "Staying's dangerous. You said so yourself — nineteen days." He has you there, and he knows it.</p>`,`<p>"I did talk to Josh," Eli says darkly. "That's why I'm asking you."</p>`];
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-eli.webp')}<div><b>Eli</b><br><small class="muted">Mercy kid</small></div></div>${replies[n]}<p>He pockets the dead phone with exaggerated care. "Fifteen's the one," he says, quieter. "You'll see."</p>${btn('BACK TO MERCY','mercyDay()','primary')}</div>`)}



function departure(){g.phase='departure';noteTreatment('hank','agreed_to_forty');save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="eyebrow">DUSK</div><h2>LEAVING MERCY</h2><div class="speaker">${portrait('portrait-ruth.webp')}<div><b>Ruth</b><br><small class="muted">Mercy council leader</small></div></div><p>Ruth stands by the truck with her hands folded. She looks at Mara for a long moment. "You go," she says. "Learn the road for real." Then, to you: "And bring her back too." It isn't quite an order.</p><p><b>Mara:</b> "I will."</p><p>Ruth turns to Josh. The look between them is twenty years old.</p><p>"I'm asking you to go with them," Ruth says. "Through Forty. They need a mechanic. They need somebody who's survived that road."</p><p>Josh goes very still. "Ruth—"</p><p>"You know that country."</p><p>Mara unrolls her route across the hood. Josh looks at it for a long moment — the I-40 corridor, marked in her careful hand. Something in his face changes.</p><p>A long silence. Then, quietly: "I'll get you through Forty. That's all I'm promising."</p><p>For a while nobody moves. Somewhere in Mercy a dog barks, and is shushed. Wind moves through the gardens in old tires. You look toward the gate — the road beyond it, empty and waiting.</p><p>Packing is quick. Everything useful is already in piles — Mercy has been preparing for this longer than you've been asking for it. Four containers of water. Food weighed to the ounce. Mara's maps, rolled tight. Josh's tools.</p><p>Then Josh crouches to Eli's eye level, and the yard goes quiet.</p>${btn('WITNESS IT','departureArgument()','primary')}</div>`)}



function departureArgument(){noteTreatment('eli','saw_the_argument');save();
const pressed=g.npcs&&g.npcs.hank&&g.npcs.hank.treatment&&g.npcs.hank.treatment.includes('pressed_about_past');
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="speaker">${portrait('portrait-hank.webp')}<div><b>Josh</b><br><small class="muted">Mercy mechanic</small></div></div><p><b>Josh:</b> "You're staying, Eli."</p><p><b>Eli:</b> "You don't get to decide that!"</p><p><b>Josh:</b> "Somebody has to—" He stops. Starts again. Can't.</p><p><b>Eli:</b> "You don't even want to go. So why do you get to?"</p><p>That lands. Josh has no answer that isn't the truth, and the truth would break them both.</p><p>What passes between them has no words in it. A man who became a father by accident, and a boy who noticed.</p><p><b>Eli:</b> "Fine." His hand closes white-knuckled around the dead phone — for a second you think he'll throw it — and then he storms off between the houses without looking back.</p>${pressed?`<p class="muted">You asked about the notches this morning. You understand, a little, what leaving costs him.</p>`:''}${btn('GIVE HIM A MINUTE','departurePhone()','primary')}</div>`)}



function departurePhone(){g.crew=g.crew.filter(c=>c.name!=='Eli');g.flags.eliStays=true;noteTreatment('eli','stayed_in_mercy');save();
screen(`${hud()}${scene('bg-mercy.webp')}<div class="panel"><div class="eyebrow">DAWN</div><p>Josh doesn't expect a goodbye. He's wrong about a lot of things, but he's sure about this one.</p><p>He's wrong.</p><p>Tucked into his tool bag, under the wrenches: the dead phone. And a scratched note in a kid's handwriting:</p><p style="text-align:center"><i>15's the one.</i></p><p>Fourteen times Josh tried and told him it couldn't be fixed.</p><p>Josh stares at it for a long time.</p><p>He doesn't say anything.</p><p>He puts it safely in his pocket.</p>${btn('LEAVE MERCY','phase1Done()','primary')}</div>`)}



function phase1Done(){g.phase='phase1_done';g.flags.phase1=true;save();
screen(`${scene('bg-mercy.webp')}<div class="panel"><p>Mercy shrinks in the mirror — the walls, the gardens in old tires, a hundred and eighty-six people. Nineteen days.</p><p>Somewhere behind you, a kid is standing in the road dust, pretending not to watch.</p><p>In Josh's pocket: a dead phone, and a note that says <i>15's the one.</i></p><p>Ahead: Colorado. ${g.spouseName}. Eight hundred miles.</p><div class="eyebrow">CHAPTER ONE: THE VOICE</div><h2>TO BE CONTINUED</h2><p class="muted">Your progress is saved. The story continues in the next update.</p>${btn('TITLE SCREEN','start()','primary')}</div>`)}


