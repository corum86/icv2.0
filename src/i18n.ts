// UI strings (EN/DE). CV content lives in data.ts.
export const RARITY_COLORS=['#b8b6c4','#5fb4ff','#b48bff','#ffb84d'];
const BASE={
en:{nav:['Experience','Skills','Education','Contact'],play:'Play',dark:'Dark',light:'Light',loc:'Wuppertal, Germany',role:'Web & Software Developer',spec:'Full-Stack · Frontend focus',
profile:'Experienced Full-Stack Software Engineer with a strong focus on frontend development and modern web applications. Proven track record of leading technical teams, building dynamic single-page applications (SPAs), and integrating AI-powered development tools. Passionate about clean code, performance optimization, and scalable architectures.',
email:'Email me',stackLabel:'core stack',termHint:"type 'help'",fYears:'years building for the web',fEcs:'at ECS GmbH',fLang:'languages spoken',fEdu:'Computer Engineering',
sExp:'experience',sSkills:'skills',sEdu:'education',sLang:'languages',sContact:'contact',present:'present',grep:'filter skills…',matches:'matches',all:'All',none:'No matches.',
cTitle:"Let's build something.",zTitle:'Keep scrolling to enter game mode',zReady:'Entering game mode…',zSub:'The rest of this CV is playable.',zSkip:'Skip, enter now',zBtn:'Enter game mode',
cats:{frontend:'Frontend & UI',backend:'Backend & Languages',databases:'Databases',apis:'APIs & Architecture',quality:'Quality & Testing',ai:'AI Tooling',devops:'DevOps & VCS',platforms:'Platforms & Tools'},
g:{status:'STATUS',items:'ITEMS',quests:'QUESTS',exit:'EXIT TO CV',on:'SOUND ON',off:'SOUND OFF',lv:'LV',cls:'Full-Stack Engineer',specV:'Frontend',
controls:'ARROWS / WASD move · click to walk · C status · I items · Q quests · ESC close',
intro:"Welcome, traveler. This village holds the story of Sergkei Kournosenkov. Walk with the arrow keys or WASD, or click any building. Every door opens a chapter.",
allDone:"All five areas explored. You've seen the whole CV. The Post Office sends ravens straight to Sergkei.",
enter:'You enter the',found:'NEW AREA',ach:'ACHIEVEMENT UNLOCKED: EXPLORER',explored:'explored',close:'ESC · CLOSE',
b:{guild:'GUILD HALL',armory:'ARMORY',post:'POST OFFICE',academy:'ACADEMY',tavern:'TAVERN'},
p:{quests:'QUEST LOG',items:'INVENTORY',contact:'POST OFFICE',academy:'ACADEMY · SCROLLS',tavern:'TAVERN',status:'CHARACTER'},
giver:'Quest giver',when:'Period',reward:'Reward',active:'ACTIVE',done:'COMPLETE',side:'SIDE QUEST · COMPLETE',obj:'OBJECTIVES',yrs:'y',mos:'m',xp:'experience',
rar:['COMMON','RARE','EPIC','LEGENDARY'],type:'Type',found_in:'Used at',fromCv:'Listed in technical skills',
itemHint:'← → select item · ↑ ↓ switch category',questHint:'↑ ↓ select quest',
tavernIntro:'Four regulars share a table. Each one speaks a language Sergkei knows.',postIntro:'Send a raven. Messages reach Sergkei directly.',raven:'SEND RAVEN',
st:{name:'Name',cls:'Class',spec:'Specialization',home:'Home',guild:'Guild',lv:'Level'},attrs:'ATTRIBUTES',
aYears:'Years in the field',aQuests:'Quests completed',aItems:'Items in inventory',aLangs:'Languages',aScrolls:'Scrolls earned'}},
de:{nav:['Erfahrung','Skills','Ausbildung','Kontakt'],play:'Spielen',dark:'Dunkel',light:'Hell',loc:'Wuppertal, Deutschland',role:'Web- & Softwareentwickler',spec:'Full-Stack · Schwerpunkt Frontend',
profile:'Erfahrener Full-Stack Software Engineer mit starkem Fokus auf Frontend-Entwicklung und moderne Webanwendungen. Nachweisliche Erfahrung in der Leitung technischer Teams, der Entwicklung dynamischer Single-Page-Applications (SPAs) und der Integration KI-gestützter Entwicklungswerkzeuge. Leidenschaft für Clean Code, Performance-Optimierung und skalierbare Architekturen.',
email:'E-Mail schreiben',stackLabel:'Kern-Stack',termHint:"tippe 'help'",fYears:'Jahre Webentwicklung',fEcs:'bei ECS GmbH',fLang:'Sprachen',fEdu:'Technische Informatik',
sExp:'erfahrung',sSkills:'skills',sEdu:'ausbildung',sLang:'sprachen',sContact:'kontakt',present:'heute',grep:'Skills filtern…',matches:'Treffer',all:'Alle',none:'Keine Treffer.',
cTitle:'Lass uns etwas bauen.',zTitle:'Weiterscrollen, um den Spielmodus zu starten',zReady:'Spielmodus startet…',zSub:'Der Rest dieses Lebenslaufs ist spielbar.',zSkip:'Überspringen, jetzt starten',zBtn:'Spielmodus starten',
cats:{frontend:'Frontend & UI',backend:'Backend & Sprachen',databases:'Datenbanken',apis:'APIs & Architektur',quality:'Qualität & Tests',ai:'KI-Tools',devops:'DevOps & VCS',platforms:'Plattformen & Tools'},
g:{status:'STATUS',items:'INVENTAR',quests:'QUESTS',exit:'ZUM CV',on:'TON AN',off:'TON AUS',lv:'LV',cls:'Full-Stack Engineer',specV:'Frontend',
controls:'PFEILE / WASD laufen · klicken zum Hinlaufen · C Status · I Inventar · Q Quests · ESC schließen',
intro:'Willkommen, Reisender. Dieses Dorf erzählt die Geschichte von Sergkei Kournosenkov. Lauf mit Pfeiltasten oder WASD, oder klick auf ein Gebäude. Jede Tür öffnet ein Kapitel.',
allDone:'Alle fünf Orte erkundet. Du kennst jetzt den ganzen Lebenslauf. Das Postamt schickt Raben direkt zu Sergkei.',
enter:'Du betrittst:',found:'NEUER ORT',ach:'ERFOLG FREIGESCHALTET: ENTDECKER',explored:'erkundet',close:'ESC · SCHLIESSEN',
b:{guild:'GILDENHALLE',armory:'WAFFENKAMMER',post:'POSTAMT',academy:'AKADEMIE',tavern:'TAVERNE'},
p:{quests:'QUESTLOG',items:'INVENTAR',contact:'POSTAMT',academy:'AKADEMIE · SCHRIFTROLLEN',tavern:'TAVERNE',status:'CHARAKTER'},
giver:'Auftraggeber',when:'Zeitraum',reward:'Belohnung',active:'AKTIV',done:'ABGESCHLOSSEN',side:'NEBENQUEST · ABGESCHLOSSEN',obj:'ZIELE',yrs:'J',mos:'M',xp:'Erfahrung',
rar:['GEWÖHNLICH','SELTEN','EPISCH','LEGENDÄR'],type:'Typ',found_in:'Eingesetzt bei',fromCv:'In den technischen Skills gelistet',
itemHint:'← → Item wählen · ↑ ↓ Kategorie wechseln',questHint:'↑ ↓ Quest wählen',
tavernIntro:'Vier Stammgäste teilen sich einen Tisch. Jeder spricht eine Sprache, die Sergkei beherrscht.',postIntro:'Schick einen Raben. Nachrichten erreichen Sergkei direkt.',raven:'RABEN SENDEN',
st:{name:'Name',cls:'Klasse',spec:'Spezialisierung',home:'Heimat',guild:'Gilde',lv:'Level'},attrs:'ATTRIBUTE',
aYears:'Jahre im Beruf',aQuests:'Abgeschlossene Quests',aItems:'Items im Inventar',aLangs:'Sprachen',aScrolls:'Schriftrollen'}}
};
export const THEMES={dark:{bg:'#0f0e13',fg:'#ecebf1',mut:'#9c9aa8',line:'#26242e',card:'#16151c',acc:'#b48bff'},light:{bg:'#f7f6f9',fg:'#17161c',mut:'#5b5967',line:'#e3e1e9',card:'#ffffff',acc:'#6d35d6'}};

const EXTRA={
en:{form:{title:'Send a message',name:'Name',email:'Email',message:'Message',send:'Send message',sending:'Sending…',ok:'Thanks! Your message is on its way.',err:'Something went wrong. Please email me directly.',privacy:'Your data is only used to reply to your message. See the',privacyLink:'privacy policy'},
 footer:{privacy:'Privacy'},skip:'Skip to content',
 g:{touch:'Swipe or hold the pad to walk · tap a building',letter:'WRITE A LETTER',back:'BACK'}},
de:{form:{title:'Nachricht senden',name:'Name',email:'E-Mail',message:'Nachricht',send:'Nachricht senden',sending:'Wird gesendet…',ok:'Danke! Deine Nachricht ist unterwegs.',err:'Etwas ist schiefgelaufen. Bitte schreib mir direkt per E-Mail.',privacy:'Deine Daten werden nur zur Beantwortung deiner Nachricht verwendet. Siehe',privacyLink:'Datenschutzerklärung'},
 footer:{privacy:'Datenschutz'},skip:'Zum Inhalt springen',
 g:{touch:'Wischen oder Steuerkreuz halten zum Laufen · Gebäude antippen',letter:'BRIEF SCHREIBEN',back:'ZURÜCK'}}
};
const merge=(a:any,b:any):any=>{const o:any={...a};for(const k in b)o[k]=(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k]))?merge(a[k]||{},b[k]):b[k];return o;};
export const T={en:merge(BASE.en,EXTRA.en),de:merge(BASE.de,EXTRA.de)} as {en:Dict;de:Dict};
export type Dict=typeof BASE.en & typeof EXTRA.en & {g:typeof BASE.en.g & typeof EXTRA.en.g};
