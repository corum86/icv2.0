// UI strings (EN/DE/EL). CV content lives in data.ts.
import type { Lang } from './data';
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
aYears:'Jahre im Beruf',aQuests:'Abgeschlossene Quests',aItems:'Items im Inventar',aLangs:'Sprachen',aScrolls:'Schriftrollen'}},
// Greek. Tech terms, job titles and commands stay English, as they're used in Greek tech. All-caps Greek has no accents.
el:{nav:['Εμπειρία','Δεξιότητες','Εκπαίδευση','Επικοινωνία'],play:'Παίξε',dark:'Σκούρο',light:'Ανοιχτό',loc:'Βούπερταλ, Γερμανία',role:'Web & Software Developer',spec:'Full-Stack · Έμφαση στο Frontend',
profile:'Έμπειρος Full-Stack Software Engineer με έντονη έμφαση στο frontend και στις σύγχρονες web εφαρμογές. Αποδεδειγμένη εμπειρία στην καθοδήγηση τεχνικών ομάδων, στην ανάπτυξη δυναμικών single-page applications (SPAs) και στην ενσωμάτωση εργαλείων ανάπτυξης με AI. Με πάθος για clean code, βελτιστοποίηση απόδοσης και κλιμακώσιμες αρχιτεκτονικές.',
email:'Στείλε email',stackLabel:'βασικό stack',termHint:"γράψε 'help'",fYears:'χρόνια ανάπτυξης για το web',fEcs:'στην ECS GmbH',fLang:'γλώσσες',fEdu:'Μηχανικός Πληροφορικής',
sExp:'εμπειρία',sSkills:'δεξιότητες',sEdu:'εκπαίδευση',sLang:'γλώσσες',sContact:'επικοινωνία',present:'σήμερα',grep:'φίλτρο δεξιοτήτων…',matches:'αποτελέσματα',all:'Όλα',none:'Κανένα αποτέλεσμα.',
cTitle:'Ας φτιάξουμε κάτι μαζί.',zTitle:'Συνέχισε το scroll για να μπεις στο παιχνίδι',zReady:'Φόρτωση παιχνιδιού…',zSub:'Το υπόλοιπο βιογραφικό παίζεται.',zSkip:'Παράλειψη, μπες τώρα',zBtn:'Μπες στο παιχνίδι',
cats:{frontend:'Frontend & UI',backend:'Backend & γλώσσες',databases:'Βάσεις δεδομένων',apis:'APIs & αρχιτεκτονική',quality:'Ποιότητα & testing',ai:'Εργαλεία AI',devops:'DevOps & VCS',platforms:'Πλατφόρμες & εργαλεία'},
g:{status:'ΚΑΤΑΣΤΑΣΗ',items:'ΑΝΤΙΚΕΙΜΕΝΑ',quests:'ΑΠΟΣΤΟΛΕΣ',exit:'ΕΞΟΔΟΣ ΣΤΟ CV',on:'ΗΧΟΣ ON',off:'ΗΧΟΣ OFF',lv:'LV',cls:'Full-Stack Engineer',specV:'Frontend',
controls:'ΒΕΛΑΚΙΑ / WASD κίνηση · κλικ για περπάτημα · C κατάσταση · I αντικείμενα · Q αποστολές · ESC κλείσιμο',
intro:'Καλώς ήρθες, ταξιδιώτη. Αυτό το χωριό κρύβει την ιστορία του Sergkei Kournosenkov. Περπάτα με τα βελάκια ή WASD, ή κάνε κλικ σε ένα κτίριο. Κάθε πόρτα ανοίγει ένα κεφάλαιο.',
allDone:'Εξερεύνησες και τις πέντε περιοχές. Είδες όλο το βιογραφικό. Το Ταχυδρομείο στέλνει κοράκια κατευθείαν στον Sergkei.',
enter:'Μπαίνεις:',found:'ΝΕΑ ΠΕΡΙΟΧΗ',ach:'ΕΠΙΤΕΥΓΜΑ: ΕΞΕΡΕΥΝΗΤΗΣ',explored:'εξερευνήθηκαν',close:'ESC · ΚΛΕΙΣΙΜΟ',
b:{guild:'ΣΥΝΤΕΧΝΙΑ',armory:'ΟΠΛΟΘΗΚΗ',post:'ΤΑΧΥΔΡΟΜΕΙΟ',academy:'ΑΚΑΔΗΜΙΑ',tavern:'ΤΑΒΕΡΝΑ'},
p:{quests:'ΗΜΕΡΟΛΟΓΙΟ ΑΠΟΣΤΟΛΩΝ',items:'ΣΑΚΙΔΙΟ',contact:'ΤΑΧΥΔΡΟΜΕΙΟ',academy:'ΑΚΑΔΗΜΙΑ · ΠΑΠΥΡΟΙ',tavern:'ΤΑΒΕΡΝΑ',status:'ΧΑΡΑΚΤΗΡΑΣ'},
giver:'Εντολέας',when:'Περίοδος',reward:'Ανταμοιβή',active:'ΣΕ ΕΞΕΛΙΞΗ',done:'ΟΛΟΚΛΗΡΩΘΗΚΕ',side:'ΔΕΥΤΕΡΕΥΟΥΣΑ ΑΠΟΣΤΟΛΗ · ΟΛΟΚΛΗΡΩΘΗΚΕ',obj:'ΣΤΟΧΟΙ',yrs:'χ',mos:'μ',xp:'εμπειρία',
rar:['ΚΟΙΝΟ','ΣΠΑΝΙΟ','ΕΠΙΚΟ','ΘΡΥΛΙΚΟ'],type:'Τύπος',found_in:'Χρήση σε',fromCv:'Από τις τεχνικές δεξιότητες',
itemHint:'← → επιλογή αντικειμένου · ↑ ↓ αλλαγή κατηγορίας',questHint:'↑ ↓ επιλογή αποστολής',
tavernIntro:'Τέσσερις θαμώνες μοιράζονται ένα τραπέζι. Ο καθένας μιλά μια γλώσσα που ξέρει ο Sergkei.',postIntro:'Στείλε ένα κοράκι. Τα μηνύματα φτάνουν κατευθείαν στον Sergkei.',raven:'ΣΤΕΙΛΕ ΚΟΡΑΚΙ',
st:{name:'Όνομα',cls:'Κλάση',spec:'Ειδίκευση',home:'Έδρα',guild:'Συντεχνία',lv:'Level'},attrs:'ΙΔΙΟΤΗΤΕΣ',
aYears:'Χρόνια στον χώρο',aQuests:'Ολοκληρωμένες αποστολές',aItems:'Αντικείμενα στο σακίδιο',aLangs:'Γλώσσες',aScrolls:'Πάπυροι'}}
};
export const THEMES={dark:{bg:'#0f0e13',fg:'#ecebf1',mut:'#9c9aa8',line:'#26242e',card:'#16151c',acc:'#b48bff'},light:{bg:'#f7f6f9',fg:'#17161c',mut:'#5b5967',line:'#e3e1e9',card:'#ffffff',acc:'#6d35d6'}};

const EXTRA={
en:{form:{title:'Send a message',name:'Name',email:'Email',message:'Message',send:'Send message',sending:'Sending…',ok:'Thanks! Your message is on its way.',err:'Something went wrong. Please email me directly.',privacy:'Your data is only used to reply to your message. See the',privacyLink:'privacy policy'},
 footer:{privacy:'Privacy'},skip:'Skip to content',
 navWork:'Work',sWork:'selected work',caseStudy:'Case study',live:'Live site',code:'Code',projects:'projects',
 wProblem:'Problem',wApproach:'Approach',wResult:'Result',wRole:'Role',wStack:'Stack',wYear:'Year',versions:'versions',
 mobile:'Mobile',desktop:'desktop',offline:'Offline',offlineNote:'This site is no longer online.',archive:'View on Web Archive',beforeAfter:'Before / after',
 wFilter:'Filter projects',wPrev:'Previous project',wNext:'Next project',wClose:'Close case study',
 g:{touch:'Tap to walk or swipe the map · tap a building',letter:'WRITE A LETTER',back:'BACK',zoomIn:'Zoom in',zoomOut:'Zoom out'}},
de:{form:{title:'Nachricht senden',name:'Name',email:'E-Mail',message:'Nachricht',send:'Nachricht senden',sending:'Wird gesendet…',ok:'Danke! Deine Nachricht ist unterwegs.',err:'Etwas ist schiefgelaufen. Bitte schreib mir direkt per E-Mail.',privacy:'Deine Daten werden nur zur Beantwortung deiner Nachricht verwendet. Siehe',privacyLink:'Datenschutzerklärung'},
 footer:{privacy:'Datenschutz'},skip:'Zum Inhalt springen',
 navWork:'Projekte',sWork:'ausgewählte projekte',caseStudy:'Case Study',live:'Live-Seite',code:'Code',projects:'Projekte',
 wProblem:'Problem',wApproach:'Vorgehen',wResult:'Ergebnis',wRole:'Rolle',wStack:'Stack',wYear:'Jahr',versions:'Versionen',
 mobile:'Mobil',desktop:'Desktop',offline:'Offline',offlineNote:'Diese Website ist nicht mehr online.',archive:'Im Web Archive ansehen',beforeAfter:'Vorher / Nachher',
 wFilter:'Projekte filtern',wPrev:'Vorheriges Projekt',wNext:'Nächstes Projekt',wClose:'Case Study schließen',
 g:{touch:'Zum Laufen tippen oder über die Karte wischen · Gebäude antippen',letter:'BRIEF SCHREIBEN',back:'ZURÜCK',zoomIn:'Vergrößern',zoomOut:'Verkleinern'}},
el:{form:{title:'Στείλε μήνυμα',name:'Όνομα',email:'Email',message:'Μήνυμα',send:'Αποστολή μηνύματος',sending:'Αποστολή…',ok:'Ευχαριστώ! Το μήνυμά σου στάλθηκε.',err:'Κάτι πήγε στραβά. Στείλε μου απευθείας email.',privacy:'Τα στοιχεία σου χρησιμοποιούνται μόνο για να απαντήσω στο μήνυμά σου. Δες την',privacyLink:'πολιτική απορρήτου'},
 footer:{privacy:'Απόρρητο'},skip:'Μετάβαση στο περιεχόμενο',
 navWork:'Έργα',sWork:'επιλεγμένα έργα',caseStudy:'Case study',live:'Δες τη σελίδα',code:'Code',projects:'έργα',
 wProblem:'Πρόβλημα',wApproach:'Προσέγγιση',wResult:'Αποτέλεσμα',wRole:'Ρόλος',wStack:'Stack',wYear:'Έτος',versions:'εκδόσεις',
 mobile:'Κινητό',desktop:'desktop',offline:'Offline',offlineNote:'Αυτή η σελίδα δεν είναι πλέον online.',archive:'Δες το στο Web Archive',beforeAfter:'Πριν / μετά',
 wFilter:'Φίλτρο έργων',wPrev:'Προηγούμενο έργο',wNext:'Επόμενο έργο',wClose:'Κλείσιμο case study',
 g:{touch:'Πάτα για να περπατήσεις ή σύρε τον χάρτη · πάτα ένα κτίριο',letter:'ΓΡΑΨΕ ΓΡΑΜΜΑ',back:'ΠΙΣΩ',zoomIn:'Μεγέθυνση',zoomOut:'Σμίκρυνση'}}
};
// Compile-time check: every language defines every key of the English dictionaries.
BASE.de satisfies typeof BASE.en; BASE.el satisfies typeof BASE.en;
EXTRA.de satisfies typeof EXTRA.en; EXTRA.el satisfies typeof EXTRA.en;
const merge=(a:any,b:any):any=>{const o:any={...a};for(const k in b)o[k]=(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k]))?merge(a[k]||{},b[k]):b[k];return o;};
export const T={en:merge(BASE.en,EXTRA.en),de:merge(BASE.de,EXTRA.de),el:merge(BASE.el,EXTRA.el)} as Record<Lang,Dict>;
export type Dict=typeof BASE.en & typeof EXTRA.en & {g:typeof BASE.en.g & typeof EXTRA.en.g};
