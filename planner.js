import {understand,focusedActions,contextNote} from './context.js?v=3';
export {understand,contextNote} from './context.js?v=3';
export const DEFAULTS={mode:'daily',energy:'okay',minutes:20,setting:'campus',equipment:'none'};
const action=(id,category,title,body,duration,easyTitle,easyBody)=>({id,category,title,body,duration,easyTitle,easyBody});
export const library={
movement:[action('walk','movement','Take the scenic route.','Step away from your screen for a comfortable walk or roll. Leave the headphones off for a minute and notice your surroundings.',8,'Change your view.','Spend two minutes by a window or outside, seated or standing. You do not need to go far.'),action('loosen','movement','Unfold from your desk.','Take a few minutes of comfortable movement: loosen your hands and shoulders, change position, or walk around your room. Stay within a pain-free range.',5,'Unclench. Exhale.','Relax your hands and shoulders and change position for one minute.'),action('music','movement','Move to one good song.','Put on a favorite song. Move however feels good: seated, standing, or a gentle walk. This is a break, not a workout test.',4,'Press play.','Listen to one minute of a favorite song. Moving is optional.')],
connection:[action('club','connection','Find your kind of people.','Open your campus club directory. Choose one club you are curious about and check its next meeting. Save the real date before making plans.',7,'Just find one club.','Spend two minutes finding a club name that interests you. You can decide about attending later.'),action('friend','connection','Send the first hello.','Message someone you already know: “Hey, I thought of you today. How have you been?” No perfect wording and no pressure for an instant reply.',3,'Send a small hello.','Send a quick “Thinking of you—hope your day is going okay” to someone you know.'),action('kind','connection','Notice something good.','If a natural moment comes up, offer a sincere compliment about someone’s effort or choice: “Your explanation really helped me.” Let them choose whether to keep talking.',3,'Make room for kindness.','Think of someone whose effort you appreciate. Write one sentence you could tell them later.'),action('smile','connection','Make a small connection.','If someone seems open to it, give a friendly hello or smile. Keep it light, respect their space, and move on if they do not engage.',2,'Reconnect with someone familiar.','Send a friendly emoji or hello to someone you already know.')],
reset:[action('shutdown','reset','Give work a finish line.','Write down your next work step, close the extra tabs, and put your screen aside for a few minutes. You can return without carrying it all in your head.',5,'Close one loop.','Write down the next thing you will do when you return, then look away from the screen for a minute.'),action('pause','reset','Have a moment with no goal.','Sit somewhere comfortable. Look out a window, sip a drink, or simply rest. You do not have to make this time useful.',5,'Take one quiet minute.','Put your phone face down for one minute. Let this be a pause with no task attached.'),action('joy','reset','Do a tiny thing you like.','Read a few pages, sketch something silly, or listen to a favorite song. Choose enjoyment over achievement for a few minutes.',6,'Choose a small pleasure.','Play a minute of a song you like or look at a favorite photo.')],
gym:[action('gym-walk','movement','Make showing up enough.','Take an easy walk, roll, or comfortable movement break. If you are at the gym, choose a familiar, easy activity. You should feel free to stop early.',10,'Start with two minutes.','Try two minutes of comfortable movement. Decide afterward whether you want more.'),action('gym-session','movement','Keep the session familiar.','Use comfortable movements you already know. Start easy, take breaks, and finish before you feel drained. If equipment is unfamiliar, ask gym staff to show you.',20,'Keep it light.','Take a short, easy movement break instead of a full session. No need to push today.'),action('gym-prepare','movement','Lower the starting barrier.','Set out your shoes and water, choose a familiar activity, and pick a realistic time. Planning counts today; the session can happen when you have room.',5,'Put out your shoes.','Set out one thing that makes your next movement break easier.')],
recovery:[action('recover','reset','Leave room to recover.','After moving, slow down and take a comfortable seated break. Notice how you feel. Rest is part of looking after yourself.',5,'Sit. Breathe. Reset.','Take a quiet minute in a comfortable position.'),action('gym-boundary','reset','Skip the comparison.','Choose one thing to appreciate about showing up, regardless of distance, weight, or appearance. Write it down and let the session be enough.',3,'Count showing up.','Write: “I made a little room for myself today.”')]
};
function candidates(c,p){
 const defaults=p.focus?[]:(c.mode==='gym'?library.gym:library.movement).concat(library.connection, c.mode==='gym'?library.recovery:library.reset).map(a=>({...a,tags:[]}));
 const pool=[...focusedActions,...defaults];
 return pool.filter(a=>{
  if((p.solo||p.sleep||p.injury||p.crisis||p.focus==='calm'||p.focus==='rest')&&a.category==='connection')return false;
  if((p.noGym||p.sleep||p.injury||p.crisis||p.focus==='calm'||p.focus==='rest')&&a.category==='movement')return false;
  if(a.tags.includes('campus')&&p.setting!=='campus')return false;
  if(a.id==='community-find'&&p.setting==='campus')return false;
  if(p.noFriends&&['friend-invite','friend','smile'].includes(a.id))return false;
  if(p.indoors&&['walk','gym-walk','smile','kind','friend-invite'].includes(a.id))return false;
  if(a.tags.includes('gym')&&!(p.gym||c.mode==='gym'))return false;
  if(p.noGym&&a.tags.includes('gym'))return false;
  return true;
 }).map((a,i)=>{
  let score=0;
  if(p.focus&&a.tags.includes(p.focus))score+=30;
  if(p.fun&&a.tags.includes('fun'))score+=12;
  if(p.work&&a.tags.includes('work')&&!p.fun)score+=6;
  if(p.noFriends&&a.tags.includes('new-people'))score+=15;
  if(/compliment|smile/.test(p.text)&&a.id==='compliment')score+=40;
  if(/club/.test(p.text)&&a.id==='club-find')score+=40;
  if(/music|song/.test(p.text)&&a.id==='listen')score+=40;
  if(/draw|doodle|sketch/.test(p.text)&&a.id==='doodle')score+=40;
  if(p.focus==='calm'&&['doodle','listen','notice'].includes(a.id))score+=10;
  if(!p.focus){if(['walk','friend','shutdown'].includes(a.id))score+=10;if(c.mode==='gym'&&a.tags.includes('gym'))score+=12;}
  return {...a,score,order:i};
 }).sort((a,b)=>b.score-a.score||a.order-b.order);
}
function prepared(a,p){const {tags,score,order,...base}=a;return {...base,done:false,easy:false,reason:p.focus?contextNote({...p,indoors:false,noGym:false}):reason(a,{energy:p.low?'low':'okay'}),match:{...p,text:''}};}
function fit(list,budget,low){let result=low?list.map(easier):list;while(result.reduce((n,a)=>n+a.duration,0)>budget){const i=result.findIndex(a=>!a.easy);if(i<0)break;result[i]=easier(result[i]);}return result;}
export function makePlan(checkin,context='',rotation=0){
 const c={...DEFAULTS,...checkin},p=understand(context,c);let ranked=candidates(c,p);
 // Text relevance remains stable on rebuild; only Swap changes a recommendation.
 const count=Math.min(3,Math.max(1,Math.floor(p.budget)));
 const chosen=[];
 if(!p.focus){for(const category of ['movement','connection','reset']){const item=ranked.find(a=>a.category===category&&!chosen.includes(a));if(item)chosen.push(item);}}
 for(const a of ranked){if(chosen.length>=count)break;if(!chosen.includes(a))chosen.push(a);}
 return fit(chosen.slice(0,count).map(a=>prepared(a,p)),p.budget,p.low);
}
function reason(x,c){if(c.energy==='low')return 'You selected low energy. Keep the starting point small.';return x.category==='connection'?'A small, respectful way to make room for connection.':x.category==='movement'?'A manageable change of pace.':'A pause that does not need to become another assignment.';}
export function easier(x){return {...x,title:x.easyTitle,body:x.easyBody.replace(/two minutes/gi,'one minute'),duration:1,easy:true,done:false};}
export function swapAction(x,c,used=[],context=''){
 const p=context?understand(context,c):x.match||understand('',c);const pool=candidates(c,p).filter(a=>!used.some(u=>u.id===a.id));
 if(!pool.length)return x;
 const available=p.budget-used.filter(a=>a!==x).reduce((n,a)=>n+a.duration,0);
 const item=prepared(pool[0],p);return p.low||item.duration>available?easier(item):item;
}
// A new topic replaces the old request. Short constraints refine it instead.
export function conversationRequest(previous,latest,c={}){
 const p=understand(latest,c);
 if(p.focus||!previous)return latest;
 return p.recognized||/another|different|instead|easier|smaller|simpler|no talking|no music/.test(p.text)?`${previous}. ${latest}`:latest;
}
export function guidedReply(text,c,plan,priorContext=''){
 const p=understand(text,c);
 if(p.crisis)return 'I’m sorry you’re feeling this much pain. Please reach out to someone you trust who can stay with you. If you might act on these thoughts, contact local emergency services or a crisis service now. This demo cannot provide crisis care.';
 if(p.injury)return 'Let’s pause the workout idea. I can’t assess symptoms or injuries. Choose rest and ask a qualified clinician about safe activity; if symptoms are severe or urgent, seek immediate medical help.';
 if(/^(?:hi|hello|hey)[!. ]*$/.test(p.text))return 'Hey. What would help right now: a calming activity, something fun, movement, or a way to connect? Tell me how much time you have, too.';
 if(/\b(?:easier|too much|smaller|simpler)\b/.test(p.text)&&plan.length){const a=easier(plan[0]);return `Let’s shrink the first step: ${a.body} One minute is enough. You can ignore the other cards for now.`;}
 const combined=conversationRequest(priorContext,text,c);
 const match=understand(combined,c);
 if(!p.recognized&&!/another|different|instead|indoors|outside/.test(p.text))return 'I’m not sure I understood that specific request. Would you like a calming activity, something fun, a movement break, or a way to meet people? Include any limits, such as “at home, five minutes, no talking.”';
 const options=makePlan(c,combined);const first=options[0];
 return `${contextNote(match)}\n\nTry this (${first.duration} min): ${first.title} ${first.body}\n\n${options[1]?`Another option: ${options[1].title} ${options[1].body}`:'That can be your whole break.'}\n\nUse “Use this conversation for my plan” below to update the cards.`;
}
export function calendarEvent(action,start){const d=new Date(start);if(Number.isNaN(d.getTime()))throw Error('Choose a valid date and time.');const stamp=v=>v.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Daily Bro//Small steps//EN','BEGIN:VEVENT',`UID:${crypto.randomUUID()}@daily-bro`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(d)}`,`DTEND:${stamp(new Date(d.getTime()+action.duration*60000))}`,`SUMMARY:${escape(action.title)}`,`DESCRIPTION:${escape(action.body+' Personal reminder only; no event booking.')}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');}
