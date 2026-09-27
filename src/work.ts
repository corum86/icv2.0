// Selected work (portfolio). Source of truth for the Work section and the case-study drawer.
// Media files live in public/work/ (see docs/handoff/06-work-section.md → Assets).
import type { L10n } from './data';

export interface WorkVersion { year: string; label: L10n; url?: string }   // url: web.archive.org snapshot (normal, not if_)
export interface WorkMedia {
  base: string;          // e.g. '/work/nonomo' → nonomo.webm/.mp4, nonomo-poster.<ext>, nonomo-<n>.<ext>
  ext: 'jpg' | 'png';    // extension of poster + per-version stills
  video: boolean;        // has <base>.webm/.mp4 loop for the card
  mobile: boolean;       // has <base>-mobile.webm/.mp4 for the drawer
}
export interface Work {
  slug: string; year: string; client: L10n; role: L10n; title: L10n; outcome: L10n; tags: string[];
  problem?: L10n; approach?: L10n; result?: L10n;
  nda?: boolean; offline?: boolean;
  media?: WorkMedia;
  diagram?: 'migration';                    // abstract diagram instead of media (NDA projects)
  versions?: WorkVersion[];                 // >1 → "Before / after" tabs in the drawer
  live?: string; code?: string;
  lighthouse?: { mode: 'desktop' | 'mobile'; scores: { label: string; score: number }[] };
  stats?: { value: string; label: L10n }[];
}

/** Filter chips, in this order. 'all' = no filter. A project matches when one of its tags starts with the chip (so 'Angular' matches 'Angular 15 → 22'). */
export const WORK_TAGS = ['all', 'Angular', 'WordPress', 'JTL Shop', 'PHP', 'Responsive'] as const;

export const WORK: Work[] = [
  {
    slug: "energy-platform",
    year: "2021 – 2026",
    client: {
      en: "ECS GmbH · energy sector client",
      de: "ECS GmbH · Kunde aus dem Energiesektor",
      el: "ECS GmbH · πελάτης από τον ενεργειακό τομέα"
    },
    role: {
      en: "Frontend developer · migration lead",
      de: "Frontend-Entwickler · Migrations-Lead",
      el: "Frontend developer · migration lead"
    },
    title: {
      en: "Energy sector: streamlined bid management system",
      de: "Energiesektor: effizientes System für das Angebotsmanagement",
      el: "Ενεργειακός τομέας: βελτιστοποιημένο σύστημα διαχείρισης προσφορών"
    },
    outcome: {
      en: "Built core features (complex, adjustable questionnaire templates, versioning, sync between multiple external systems) that automate and accelerate the bid process, and led the migration from Angular 15 to 22 while development continued.",
      de: "Kernfunktionen entwickelt (komplexe, anpassbare Fragebogen-Templates, Versionierung, Synchronisierung zwischen mehreren externen Systemen), die den Angebotsprozess automatisieren und beschleunigen, und die Migration von Angular 15 auf 22 im laufenden Betrieb geleitet.",
      el: "Ανέπτυξα βασικές λειτουργίες (σύνθετα, προσαρμόσιμα templates ερωτηματολογίων, versioning, συγχρονισμό μεταξύ πολλαπλών εξωτερικών συστημάτων) που αυτοματοποιούν και επιταχύνουν τη διαδικασία των προσφορών, και ηγήθηκα του migration από Angular 15 σε 22, ενώ η ανάπτυξη συνεχιζόταν."
    },
    tags: [
      "Angular 15 → 22",
      "TypeScript",
      "Signals",
      "Bootstrap 3 → 5"
    ],
    problem: {
      en: "I joined a year after the MVP. The platform needed complex new features, and its stack (Angular 15, Bootstrap 3) had fallen far behind while the project was still under heavy development.",
      de: "Ich kam ein Jahr nach dem MVP ins Projekt. Die Plattform brauchte komplexe neue Funktionen, und ihr Stack (Angular 15, Bootstrap 3) war weit zurückgefallen, während das Projekt intensiv weiterentwickelt wurde.",
      el: "Μπήκα στο έργο έναν χρόνο μετά το MVP. Η πλατφόρμα χρειαζόταν σύνθετες νέες λειτουργίες, και το stack της (Angular 15, Bootstrap 3) είχε μείνει πολύ πίσω, ενώ το έργο βρισκόταν ακόμη σε εντατική ανάπτυξη."
    },
    approach: {
      en: "Implemented complex, adjustable templates for questionnaires, a merging and diff system with versioning, a compare feature for complex multi-level structures, and sync between multiple external systems to automate the bid process. Planned and documented the upgrade from Angular 15 to 22 and Bootstrap 3 to 5 in detail, and guided and mentored team members who were new to modern Angular (new control flow, signals).",
      de: "Umsetzung komplexer, anpassbarer Templates für Fragebögen, eines Merge- und Diff-Systems mit Versionierung, einer Vergleichsfunktion für komplexe mehrstufige Strukturen und der Synchronisierung zwischen mehreren externen Systemen zur Automatisierung des Angebotsprozesses. Detaillierte Planung und Dokumentation des Upgrades von Angular 15 auf 22 und Bootstrap 3 auf 5 sowie Anleitung und Mentoring von Teammitgliedern, die neu mit modernem Angular waren (neuer Control Flow, Signals).",
      el: "Υλοποίησα σύνθετα, προσαρμόσιμα templates για ερωτηματολόγια, ένα σύστημα merge και diff με versioning, μια λειτουργία σύγκρισης για σύνθετες δομές πολλαπλών επιπέδων και τον συγχρονισμό μεταξύ πολλαπλών εξωτερικών συστημάτων για την αυτοματοποίηση της διαδικασίας των προσφορών. Σχεδίασα και τεκμηρίωσα αναλυτικά την αναβάθμιση από Angular 15 σε 22 και από Bootstrap 3 σε 5, και καθοδήγησα μέλη της ομάδας που ήταν νέα στο σύγχρονο Angular (νέο control flow, signals)."
    },
    result: {
      en: "Migrated the whole system (150K lines of code) across seven Angular major versions and from Bootstrap 3 to 5 with no feature freeze, and brought the team up to speed on modern Angular.",
      de: "Das gesamte System (150.000 Codezeilen) über sieben Angular-Major-Versionen und von Bootstrap 3 auf 5 migriert, ohne Feature-Freeze, und das Team auf modernes Angular gebracht.",
      el: "Ολόκληρο το σύστημα (150K γραμμές κώδικα) πέρασε από επτά major εκδόσεις του Angular και από Bootstrap 3 σε 5 χωρίς feature freeze, και η ομάδα εξοικειώθηκε με το σύγχρονο Angular."
    },
    nda: true,
    diagram: "migration",
    stats: [
      {
        value: "150K",
        label: {
          en: "lines of code migrated",
          de: "Codezeilen migriert",
          el: "γραμμές κώδικα σε migration"
        }
      },
      {
        value: "15 → 22",
        label: {
          en: "Angular versions",
          de: "Angular-Versionen",
          el: "εκδόσεις Angular"
        }
      },
      {
        value: "0",
        label: {
          en: "days of feature freeze",
          de: "Tage Feature-Freeze",
          el: "ημέρες feature freeze"
        }
      }
    ]
  },
  {
    slug: "paidopsy",
    year: "2019",
    client: {
      en: "Freelance · paidopsy-trikala.gr",
      de: "Freelance · paidopsy-trikala.gr",
      el: "Freelance · paidopsy-trikala.gr"
    },
    role: {
      en: "Designer · developer · hosting",
      de: "Design · Entwicklung · Hosting",
      el: "Design · ανάπτυξη · hosting"
    },
    title: {
      en: "paidopsy-trikala.gr: custom WordPress site",
      de: "paidopsy-trikala.gr: individuelle WordPress-Website",
      el: "paidopsy-trikala.gr: custom ιστοσελίδα WordPress"
    },
    outcome: {
      en: "Designed and built a completely custom WordPress theme, and set up hosting, domain and email end to end.",
      de: "Komplett individuelles WordPress-Theme entworfen und umgesetzt, dazu Hosting, Domain und E-Mail von Grund auf eingerichtet.",
      el: "Σχεδίασα και υλοποίησα ένα εντελώς custom θέμα WordPress και έστησα από την αρχή hosting, domain και email."
    },
    tags: [
      "WordPress",
      "Custom theme",
      "PHP",
      "Hosting",
      "DNS & Email"
    ],
    problem: {
      en: "A completely new practice with no web presence. This was its first website.",
      de: "Eine komplett neue Praxis ohne Webauftritt. Dies war ihre erste Website.",
      el: "Ένα εντελώς νέο ιατρείο χωρίς παρουσία στο διαδίκτυο. Αυτή ήταν η πρώτη του ιστοσελίδα."
    },
    approach: {
      en: "Designed the site and built a completely custom WordPress theme. Set up the whole infrastructure: hosting, domain, DNS and email.",
      de: "Design der Website und Entwicklung eines komplett individuellen WordPress-Themes. Einrichtung der gesamten Infrastruktur: Hosting, Domain, DNS und E-Mail.",
      el: "Σχεδίασα την ιστοσελίδα και ανέπτυξα ένα εντελώς custom θέμα WordPress. Έστησα όλη την υποδομή: hosting, domain, DNS και email."
    },
    result: {
      en: "Lighthouse (desktop): 98 Performance, 96 Accessibility, 100 Best Practices, 100 SEO.",
      de: "Lighthouse (Desktop): 98 Performance, 96 Barrierefreiheit, 100 Best Practices, 100 SEO.",
      el: "Lighthouse (desktop): 98 Performance, 96 Accessibility, 100 Best Practices, 100 SEO."
    },
    media: {
      base: "/work/paidopsy",
      ext: "png",
      video: false,
      mobile: false
    },
    versions: [
      {
        year: "Live",
        label: {
          en: "Live site",
          de: "Live-Seite",
          el: "Ζωντανή σελίδα"
        },
        url: "https://paidopsy-trikala.gr/"
      }
    ],
    live: "https://paidopsy-trikala.gr/",
    lighthouse: {
      mode: "desktop",
      scores: [
        {
          label: "Performance",
          score: 98
        },
        {
          label: "Accessibility",
          score: 96
        },
        {
          label: "Best Practices",
          score: 100
        },
        {
          label: "SEO",
          score: 100
        }
      ]
    }
  },
  {
    slug: "nuve",
    year: "2026",
    client: {
      en: "Freelance · Nuvé Apartment",
      de: "Freelance · Nuvé Apartment",
      el: "Freelance · Nuvé Apartment"
    },
    role: {
      en: "Design · development",
      de: "Design · Entwicklung",
      el: "Design · ανάπτυξη"
    },
    title: {
      en: "Nuvé Apartment: holiday apartment showcase",
      de: "Nuvé Apartment: Showcase für eine Ferienwohnung",
      el: "Nuvé Apartment: showcase για διαμέρισμα διακοπών"
    },
    outcome: {
      en: "Showcase site built from scratch with AI-assisted design. The visibility it created led to a nearly 100% occupancy rate.",
      de: "Showcase-Website von Grund auf mit KI-gestütztem Design gebaut. Die gewonnene Sichtbarkeit führte zu einer Auslastung von nahezu 100 %.",
      el: "Ιστοσελίδα-βιτρίνα φτιαγμένη από το μηδέν με design υποβοηθούμενο από AI. Η προβολή που δημιούργησε οδήγησε σε πληρότητα σχεδόν 100%."
    },
    tags: [
      "AI-assisted design",
      "Vercel",
      "Responsive",
      "Multilingual"
    ],
    problem: {
      en: "A holiday apartment without its own web presence needed visibility to attract guests.",
      de: "Eine Ferienwohnung ohne eigenen Webauftritt brauchte Sichtbarkeit, um Gäste zu gewinnen.",
      el: "Ένα διαμέρισμα διακοπών χωρίς δική του παρουσία στο web χρειαζόταν προβολή για να προσελκύσει επισκέπτες."
    },
    approach: {
      en: "Created the site from scratch, using AI-assisted design to move quickly from concept to a finished showcase.",
      de: "Website von Grund auf erstellt, mit KI-gestütztem Design für den schnellen Weg vom Konzept zum fertigen Showcase.",
      el: "Δημιούργησα την ιστοσελίδα από το μηδέν, με design υποβοηθούμενο από AI, ώστε να περάσω γρήγορα από την ιδέα στην ολοκληρωμένη βιτρίνα."
    },
    result: {
      en: "Nearly 100% occupancy, driven by the visibility the site created.",
      de: "Nahezu 100 % Auslastung dank der Sichtbarkeit durch die Website.",
      el: "Πληρότητα σχεδόν 100%, χάρη στην προβολή που έφερε η ιστοσελίδα."
    },
    offline: true,
    media: {
      base: "/work/nuve",
      ext: "jpg",
      video: true,
      mobile: true
    },
    versions: [
      {
        year: "2026",
        label: {
          en: "Showcase",
          de: "Showcase",
          el: "Showcase"
        }
      }
    ]
  },
  {
    slug: "nonomo",
    year: "2016 – 2019",
    client: {
      en: "Nonomella GmbH · nonomo.de",
      de: "Nonomella GmbH · nonomo.de",
      el: "Nonomella GmbH · nonomo.de"
    },
    role: {
      en: "Intern → lead developer → Head of IT",
      de: "Praktikant → Lead-Entwickler → Leiter IT",
      el: "Ασκούμενος → lead developer → Υπεύθυνος IT"
    },
    title: {
      en: "nonomo.de: from intern to shop relaunch",
      de: "nonomo.de: vom Praktikum zum Shop-Relaunch",
      el: "nonomo.de: από την πρακτική στο relaunch του shop"
    },
    outcome: {
      en: "Three stages: started as an intern, led frontend and backend on the first upgrade, then the full overhaul with a custom configurator and a modern, responsive design.",
      de: "Drei Etappen: Einstieg als Praktikant, Frontend und Backend beim ersten Upgrade, dann die komplette Überarbeitung mit individuellem Konfigurator und modernem, responsivem Design.",
      el: "Τρία στάδια: ξεκίνησα ως ασκούμενος, ανέλαβα frontend και backend στην πρώτη αναβάθμιση και μετά την πλήρη ανανέωση με custom configurator και σύγχρονο, responsive design."
    },
    tags: [
      "JTL Shop",
      "PHP",
      "Smarty",
      "MySQL",
      "Responsive"
    ],
    approach: {
      en: "2016: joined as an intern on the existing shop. Autumn 2016: first upgrade, as the main frontend and backend developer. 2019: as Head of IT, the complete overhaul with a custom product configurator and a modern, fully responsive design.",
      de: "2016: Einstieg als Praktikant am bestehenden Shop. Herbst 2016: erstes Upgrade als Haupt-Entwickler für Frontend und Backend. 2019: als Leiter IT die komplette Überarbeitung mit individuellem Produktkonfigurator und modernem, vollständig responsivem Design.",
      el: "2016: ξεκίνησα ως ασκούμενος στο υπάρχον shop. Φθινόπωρο 2016: πρώτη αναβάθμιση, ως κύριος developer για frontend και backend. 2019: ως Υπεύθυνος IT, η πλήρης ανανέωση με custom configurator προϊόντων και σύγχρονο, πλήρως responsive design."
    },
    media: {
      base: "/work/nonomo",
      ext: "jpg",
      video: true,
      mobile: true
    },
    versions: [
      {
        year: "2016",
        label: {
          en: "Start · intern",
          de: "Start · Praktikum",
          el: "Αρχή · πρακτική"
        },
        url: "https://web.archive.org/web/20160808023237/https://www.nonomo.de/"
      },
      {
        year: "2016",
        label: {
          en: "First upgrade",
          de: "Erstes Upgrade",
          el: "Πρώτη αναβάθμιση"
        },
        url: "https://web.archive.org/web/20161006000606/https://www.nonomo.de/"
      },
      {
        year: "2019",
        label: {
          en: "Relaunch",
          de: "Relaunch",
          el: "Relaunch"
        },
        url: "https://web.archive.org/web/20190103055319/https://www.nonomo.de/"
      }
    ]
  },
  {
    slug: "fidella",
    year: "2016 – 2019",
    client: {
      en: "Nonomella GmbH · fidella.org",
      de: "Nonomella GmbH · fidella.org",
      el: "Nonomella GmbH · fidella.org"
    },
    role: {
      en: "Head of IT · lead developer",
      de: "Leiter IT · Lead-Entwickler",
      el: "Υπεύθυνος IT · lead developer"
    },
    title: {
      en: "fidella.org: purchase advisor & modernisation",
      de: "fidella.org: Kaufberater & Modernisierung",
      el: "fidella.org: σύμβουλος αγοράς & εκσυγχρονισμός"
    },
    outcome: {
      en: "Built an interactive purchase advisor and modernised the shop.",
      de: "Interaktiven Kaufberater entwickelt und den Shop modernisiert.",
      el: "Ανέπτυξα έναν διαδραστικό σύμβουλο αγοράς και εκσυγχρόνισα το shop."
    },
    tags: [
      "JTL Shop",
      "PHP",
      "JavaScript",
      "Responsive"
    ],
    approach: {
      en: "Implemented a purchase advisor that guides customers to the right product, and modernised the shop design.",
      de: "Umsetzung eines Kaufberaters, der Kunden zum passenden Produkt führt, und Modernisierung des Shop-Designs.",
      el: "Υλοποίησα έναν σύμβουλο αγοράς που οδηγεί τους πελάτες στο κατάλληλο προϊόν και εκσυγχρόνισα το design του shop."
    },
    media: {
      base: "/work/fidella",
      ext: "jpg",
      video: true,
      mobile: true
    },
    versions: [
      {
        year: "2016",
        label: {
          en: "Before",
          de: "Vorher",
          el: "Πριν"
        },
        url: "https://web.archive.org/web/20160229103848/https://fidella.org/"
      },
      {
        year: "2019",
        label: {
          en: "Modernised",
          de: "Modernisiert",
          el: "Εκσυγχρονισμένο"
        },
        url: "https://web.archive.org/web/20190818065410/https://fidella.org/"
      }
    ]
  }
];
