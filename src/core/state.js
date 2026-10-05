function newQuests(){return {main:{id:'last-transmission',title:'THE LAST TRANSMISSION',objectives:[{id:'leave-mercy',text:'Leave Mercy before the water runs out',done:false},{id:'cross-north-texas',text:'Cross North Texas',done:false},{id:'cross-panhandle',text:'Cross the Panhandle',done:false},{id:'cross-corridor',text:'Survive the Dead Corridor',done:false},{id:'cross-mountains',text:'Cross the mountain passage',done:false},{id:'reach-station',text:'Reach Continuity Station Seven',done:false},{id:'uncover-truth',text:'Discover the truth behind the transmission',done:false},{id:'mercy-fate',text:'Decide the fate of Mercy',done:false}]},personal:{id:'find-them',title:'FIND THEM',stage:0},completed:[]};}


function questObj(id){return g.quests.main.objectives.find(o=>o.id===id);}


function completeObjective(id,silent){const o=questObj(id);if(o&&!o.done){o.done=true;if(!silent){log('Objective complete: '+o.text);notify('Quest updated: '+o.text);}}}


function updateQuests(silent){if(!g||!g.quests)return;if(g.flags.mercy!==undefined)completeObjective('leave-mercy',silent);if(g.flags.stranger!==undefined&&g.flags.stranger!=='met')completeObjective('cross-north-texas',silent);if(g.flags.droneResult!==undefined)completeObjective('cross-panhandle',silent);if(g.flags.pass)completeObjective('cross-corridor',silent);if(g.flags.passResolved)completeObjective('cross-mountains',silent);if(g.miles>=780)completeObjective('reach-station',silent);if(g.flags.ending!==undefined){completeObjective('uncover-truth',silent);completeObjective('mercy-fate',silent);}}


function discover(title,text){if(!g.discoveries.some(d=>d.title===title)){g.discoveries.unshift({title:title,text:text,day:g.day});log('Discovery: '+title);notify('Discovery recorded: '+title);}}


function save(){if(g)localStorage.setItem('longroad_v01',JSON.stringify(g))}

function migrateSave(s){if(!s.v)s.v=1;if(s.v<2){s.v=2;if(!s.quests)s.quests=newQuests();if(!s.discoveries)s.discoveries=[];}if(s.v<3){s.v=3;if(s.pfat===undefined)s.pfat=0;if(!s.injury)s.injury='healthy';if(s.woundedDays===undefined)s.woundedDays=0;if(s.antibiotics===undefined)s.antibiotics=2;if(s.rationing===undefined)s.rationing=false;(s.crew||[]).forEach(c=>{if(c.fatigue===undefined)c.fatigue=0;if(!c.injury)c.injury='healthy';if(c.woundedDays===undefined)c.woundedDays=0;if(c.neglectDone===undefined)c.neglectDone=false;});}if(s.v<4){s.v=4;
if(s.chapter===undefined)s.chapter=1;
if(!s.consequences)s.consequences=[];
if(!s.settlements)s.settlements={};
if(!s.npcs)s.npcs={};
if(!s.encounters)s.encounters={};
if(!s.mercy)s.mercy={contact:'none',infoTransmitted:[],supportSent:{},lastKnown:'stable'};
if(!s.route)s.route=s.sex==='Female'?'evelyn':'jack';
if(!s.spouseName)s.spouseName=s.sex==='Female'?'Daniel':'Claire';
if(s.quests&&!s.quests.personal)s.quests.personal={id:'find-them',title:'FIND THEM',stage:0};
if(s.flags&&s.consequences.length===0){var _mc=['took only what Mercy offered','convinced Mercy to vote for extra supplies','secretly took extra water','promised to return in fourteen days','scavenged outside Mercy and lost a day'];var _sm=['shared water with a desperate traveler','questioned a bloodied stranger','let a stranger follow the convoy','left a traveler behind','robbed a traveler at gunpoint'];var _bc=function(k,l,d){s.consequences.push({day:1,chapter:1,miles:0,kind:k,label:l,detail:d,actors:[],outcome:null,resolved:false,backfilled:true});};if(s.flags.mercy!==undefined&&s.flags.mercy!==null&&_mc[s.flags.mercy])_bc('decision','Mercy departure','Left Mercy: '+_mc[s.flags.mercy]+'.');if(typeof s.flags.stranger==='number'&&_sm[s.flags.stranger])_bc('encounter','The stranger','On the road: '+_sm[s.flags.stranger]+'.');if(s.flags.droneResult!==undefined)_bc('encounter','Custodian sentry','Faced a Custodian sentry on the road.');if(s.flags.pass)_bc('encounter','Mountain passage','Crossed the mountain passage.');if(s.flags.hankSecret)_bc('npc',"Josh's secret",'Josh admitted his group lost people near the old interstate works. Something was wrong there. He never understood what.');}
}
// M5 retcon correction: Eli stays in Mercy; he is never a traveling crew member.
// M5: legacy road-loop phases have no live renderer; land on the safe end-of-Chapter-One card.
if(s.v<5){s.v=5;
if(Array.isArray(s.crew))s.crew=s.crew.filter(function(c){return c&&c.name!=='Eli';});
var _lp=['opening','road','crew','journal','quest','battle','event','end','arrival','breakdown'];
if(_lp.indexOf(s.phase)>=0)s.phase='phase1_done';
}
// M6 (Milestone 2): simulation state — individual inventories, survival,
// scavenging. Conservative: fills only what's missing; empty packs, neutral
// hunger/thirst/health, no speculative content.
if(s.v<6){s.v=6;initSimState(s);}
return s}


/* Combined Milestone 2 sim-state initializer. Defensive: only fills fields
   that are missing, so v5 saves migrate cleanly and new games start sane. */
function initSimState(s){initInvState(s);initSurvState(s);if(!s.scav)s.scav={};if(!('found'in s))s.found=null;if(s.together===undefined)s.together=true;return s}


var CONSEQUENCE_KINDS=['decision','encounter','settlement','npc','mercy','quest'];


function recordConsequence(kind,label,detail,extra){if(CONSEQUENCE_KINDS.indexOf(kind)<0)return null;var e={day:g.day,chapter:g.chapter||1,miles:g.miles||0,kind:kind,label:label||'',detail:detail||'',actors:[],outcome:null,resolved:false};if(extra)for(var k in extra)e[k]=extra[k];if(!g.consequences)g.consequences=[];g.consequences.push(e);return e;}


function npcState(id){if(!g.npcs)g.npcs={};if(!g.npcs[id])g.npcs[id]={met:false,status:'alive',disposition:0,treatment:null,lastSeen:null};return g.npcs[id];}


function settleState(id){if(!g.settlements)g.settlements={};if(!g.settlements[id])g.settlements[id]={visited:false,disposition:'unknown',supportGiven:{},decisions:[],outcome:null};return g.settlements[id];}


function encounterState(id){if(!g.encounters)g.encounters={};if(!g.encounters[id])g.encounters[id]={seen:0,outcome:null,day:0};return g.encounters[id];}


function noteTreatment(id,key){const n=npcState(id);if(!Array.isArray(n.treatment))n.treatment=[];if(n.treatment.indexOf(key)<0)n.treatment.push(key);return n.treatment}

