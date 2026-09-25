// Content extracted from the CV (uploads/CV.pdf). Edit here to update both the CV page and the game.
export type Lang='en'|'de';
export type L10n={en:string;de:string};
export const CATS=['frontend','backend','databases','apis','quality','ai','devops','platforms'] as const;
export type Cat=typeof CATS[number];
export const SKILLS:{n:string;c:string;r:number}[]=[
['Angular','frontend',3],['JavaScript','frontend',3],['HTML5','frontend',3],['CSS / SCSS','frontend',3],['React','frontend',2],['Tailwind','frontend',2],['Bootstrap','frontend',2],['SASS / LESS','frontend',2],['Flutter / Dart','frontend',2],['jQuery','frontend',1],['Ajax','frontend',1],['ExtJS3','frontend',0],
['Java Spring Boot','backend',2],['PHP (OOP)','backend',2],['Smarty 2/3/4','backend',1],['C#','backend',1],['Objective C','backend',0],['Matlab','backend',0],
['MySQL','databases',2],['PostgreSQL','databases',2],['SQL Server (T-SQL)','databases',1],
['RESTful APIs','apis',3],['SOAP APIs','apis',1],['Facebook & Instagram APIs','apis',1],['Google Platforms & APIs','apis',1],
['SonarQube','quality',2],['ESLint','quality',2],['Prettier','quality',1],['Karma / Jasmine','quality',2],['Vitest','quality',2],
['Claude Code','ai',2],['GitHub Copilot','ai',2],['Gemini / Anti-gravity','ai',1],
['GitHub','devops',2],['GitLab','devops',2],['Gitea','devops',1],['Subversion','devops',0],
['Mendix (Low-code)','platforms',2],['JTL Shop','platforms',1],['JTL Wawi','platforms',1],['SAP','platforms',1],['Salesforce','platforms',1],['Jira','platforms',2],['Confluence','platforms',2],['Agile / Scrum','platforms',2],['MS Office','platforms',0],['Adobe Photoshop','platforms',0]
].map(([n,c,r])=>({n:n as string,c:c as string,r:r as number}));
export interface Job{company:string;place?:L10n;from:[number,number];to:[number,number]|null;yearsOnly?:boolean;side?:boolean;tags:string[];role:L10n;b:{en:string[];de:string[]}}
export const JOBS:Job[]=[
{company:'ECS GmbH',from:[2019,4],to:null,tags:['Angular','React','Flutter','Tailwind','Spring Boot','PostgreSQL','Mendix','Vitest','Claude Code'],
role:{en:'Software Engineer – Full-Stack (Frontend Focus)',de:'Software Engineer – Full-Stack (Schwerpunkt Frontend)'},
b:{en:['New development and maintenance of complex single-page applications (SPA) using Angular (React, Flutter).','Implementation of responsive designs with HTML5, SASS/LESS and Bootstrap/Tailwind to ensure optimal UX on all devices.','Connection of RESTful APIs to the frontend and close cooperation with the backend team (e.g. Java Spring Boot).','Optimize application performance and ensure cross-browser compatibility.','Analysis and performance optimization of complex SQL queries (MySQL/PostgreSQL) to reduce loading times in data-intensive applications','Develop low-code solutions using the Mendix platform to quickly deploy business apps.','Ensuring high code quality and maintainability through the establishment of clean code guidelines and static code analysis (SonarQube, ESLint, Prettier).','AI-powered software development with Agentic Coding (Claude Code, Github Copilot, Gemini/Anti-gravity)','Design and implementation of automated unit tests (Karma/Jasmine, Vitest) to increase test coverage and avoid regressions.','Conducting regular code reviews for quality assurance and knowledge exchange within the team.','Expert advice to project management and stakeholders on the selection of technologies and architectural decisions.','Actively promote a collaborative developer culture and guide junior developers on complex problems.'],
de:['Neuentwicklung und Wartung komplexer Single-Page-Applications (SPA) mit Angular (React, Flutter).','Umsetzung responsiver Designs mit HTML5, SASS/LESS und Bootstrap/Tailwind für eine optimale UX auf allen Geräten.','Anbindung von RESTful APIs an das Frontend und enge Zusammenarbeit mit dem Backend-Team (z. B. Java Spring Boot).','Optimierung der Anwendungsperformance und Sicherstellung der Cross-Browser-Kompatibilität.','Analyse und Performance-Optimierung komplexer SQL-Abfragen (MySQL/PostgreSQL) zur Reduzierung von Ladezeiten in datenintensiven Anwendungen.','Entwicklung von Low-Code-Lösungen mit der Mendix-Plattform zur schnellen Bereitstellung von Business-Apps.','Sicherstellung hoher Codequalität und Wartbarkeit durch Clean-Code-Richtlinien und statische Codeanalyse (SonarQube, ESLint, Prettier).','KI-gestützte Softwareentwicklung mit Agentic Coding (Claude Code, GitHub Copilot, Gemini/Anti-gravity).','Konzeption und Umsetzung automatisierter Unit-Tests (Karma/Jasmine, Vitest) zur Erhöhung der Testabdeckung und Vermeidung von Regressionen.','Regelmäßige Code-Reviews zur Qualitätssicherung und zum Wissensaustausch im Team.','Fachliche Beratung von Projektleitung und Stakeholdern bei Technologieauswahl und Architekturentscheidungen.','Aktive Förderung einer kollaborativen Entwicklerkultur und Unterstützung von Junior-Entwicklern bei komplexen Problemen.']}},
{company:'Nonomella GmbH',from:[2017,4],to:[2019,3],tags:['PHP','MySQL','JTL Shop','JTL Wawi','IT Strategy'],
role:{en:'Web Software Developer and Head of IT',de:'Web-Softwareentwickler und Leiter IT'},
b:{en:['Technical management of the IT department as well as coordination of internal and external development resources.','Support and further development of the e-commerce landscape (e.g. JTL Shop & JTL Wawi) as well as interface management.','Planning and implementation of the IT infrastructure strategy to support the operational business.','Full-stack development of features for the webshop using PHP and MySQL.'],
de:['Technische Leitung der IT-Abteilung sowie Koordination interner und externer Entwicklungsressourcen.','Betreuung und Weiterentwicklung der E-Commerce-Landschaft (z. B. JTL Shop & JTL Wawi) sowie Schnittstellenmanagement.','Planung und Umsetzung der IT-Infrastrukturstrategie zur Unterstützung des operativen Geschäfts.','Full-Stack-Entwicklung von Features für den Webshop mit PHP und MySQL.']}},
{company:'Koszewa & Koszewa GbR',from:[2014,11],to:[2017,3],tags:['jQuery','Bootstrap','PHP','MySQL','C#'],
role:{en:'Web and Software Developer',de:'Web- und Softwareentwickler'},
b:{en:['Conception and implementation of dynamic websites and applications with jQuery, Bootstrap, HTML, PHP, MySQL and C#.','Development and maintenance of internal management systems for the automation of business processes.','Design and implementation of relational database structures and complex SQL queries.','Second-level support and error analysis for existing software solutions.'],
de:['Konzeption und Umsetzung dynamischer Websites und Anwendungen mit jQuery, Bootstrap, HTML, PHP, MySQL und C#.','Entwicklung und Wartung interner Verwaltungssysteme zur Automatisierung von Geschäftsprozessen.','Entwurf und Umsetzung relationaler Datenbankstrukturen und komplexer SQL-Abfragen.','Second-Level-Support und Fehleranalyse für bestehende Softwarelösungen.']}},
{company:'Refuel / InSpot',place:{en:'Ioannina, Greece',de:'Ioannina, Griechenland'},from:[2006,1],to:[2011,1],yearsOnly:true,side:true,tags:['Support','Troubleshooting'],
role:{en:'Technical Support Staff',de:'Technischer Support'},
b:{en:['Provided technical support and troubleshooting for internet cafe systems.'],de:['Technischer Support und Fehlerbehebung für Internetcafé-Systeme.']}}
];
export const EDU:{t:L10n;s:L10n;y:string}[]=[
{t:{en:'B.Sc. in Computer Engineering (Software Engineering)',de:'B.Sc. Technische Informatik (Softwaretechnik)'},s:{en:'Technological Educational Institute of Epirus',de:'Technological Educational Institute of Epirus'},y:'2008 – 2015'},
{t:{en:'Vocational Training (Telecommunications & Networks)',de:'Berufsausbildung (Telekommunikation & Netzwerke)'},s:{en:'Vocational Training Institute, Ioannina, Greece',de:'Vocational Training Institute, Ioannina, Griechenland'},y:'2006 – 2007'},
{t:{en:'High School Diploma',de:'Schulabschluss'},s:{en:'Greek Lyceum Nuremberg',de:'Griechisches Lyzeum Nürnberg'},y:'2004'},
{t:{en:'European Computer Driving Licence (ECDL)',de:'Europäischer Computerführerschein (ECDL)'},s:{en:'Athens',de:'Athen'},y:'2006'}
];
export const LANGS:{n:L10n;l:L10n;p:number;hi:string;hue:number}[]=[
{n:{en:'Greek',de:'Griechisch'},l:{en:'Native',de:'Muttersprache'},p:100,hi:'Γεια σου!',hue:250},
{n:{en:'English',de:'Englisch'},l:{en:'C1 · Fluent',de:'C1 · Fließend'},p:85,hi:'Hello there!',hue:25},
{n:{en:'German',de:'Deutsch'},l:{en:'B2 · Very good',de:'B2 · Sehr gut'},p:70,hi:'Hallo!',hue:85},
{n:{en:'Russian',de:'Russisch'},l:{en:'Very good',de:'Sehr gut'},p:70,hi:'Привет!',hue:150}
];
export const CAREER_START=new Date(2014,10,1);
