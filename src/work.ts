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
      de: "ECS GmbH · Kunde aus dem Energiesektor"
    },
    role: {
      en: "Frontend developer · migration lead",
      de: "Frontend-Entwickler · Migrations-Lead"
    },
    title: {
      en: "Energy sector: questionnaire & versioning platform",
      de: "Energiesektor: Fragebogen- & Versionierungsplattform"
    },
    outcome: {
      en: "Built core features (dynamic questionnaire templates, merge and diff with versioning, multi-level compare) and led the migration from Angular 15 to 22 while development continued.",
      de: "Kernfunktionen entwickelt (dynamische Fragebogen-Templates, Merge und Diff mit Versionierung, mehrstufiger Vergleich) und die Migration von Angular 15 auf 22 im laufenden Betrieb geleitet."
    },
    tags: [
      "Angular 15 → 22",
      "TypeScript",
      "Signals",
      "Bootstrap 3 → 5"
    ],
    problem: {
      en: "I joined a year after the MVP. The platform needed complex new features, and its stack (Angular 15, Bootstrap 3) had fallen far behind while the project was still under heavy development.",
      de: "Ich kam ein Jahr nach dem MVP ins Projekt. Die Plattform brauchte komplexe neue Funktionen, und ihr Stack (Angular 15, Bootstrap 3) war weit zurückgefallen, während das Projekt intensiv weiterentwickelt wurde."
    },
    approach: {
      en: "Implemented dynamic, complex templates for questionnaires, a merging and diff system with versioning, and a compare feature for complex multi-level structures. Planned and documented the upgrade from Angular 15 to 22 and Bootstrap 3 to 5 in detail, and guided and mentored team members who were new to modern Angular (new control flow, signals).",
      de: "Umsetzung dynamischer, komplexer Templates für Fragebögen, eines Merge- und Diff-Systems mit Versionierung und einer Vergleichsfunktion für komplexe mehrstufige Strukturen. Detaillierte Planung und Dokumentation des Upgrades von Angular 15 auf 22 und Bootstrap 3 auf 5 sowie Anleitung und Mentoring von Teammitgliedern, die neu mit modernem Angular waren (neuer Control Flow, Signals)."
    },
    result: {
      en: "Migrated the whole system (150K lines of code) across seven Angular major versions and from Bootstrap 3 to 5 with no feature freeze, and brought the team up to speed on modern Angular.",
      de: "Das gesamte System (150.000 Codezeilen) über sieben Angular-Major-Versionen und von Bootstrap 3 auf 5 migriert, ohne Feature-Freeze, und das Team auf modernes Angular gebracht."
    },
    nda: true,
    diagram: "migration",
    stats: [
      {
        value: "150K",
        label: {
          en: "lines of code migrated",
          de: "Codezeilen migriert"
        }
      },
      {
        value: "15 → 22",
        label: {
          en: "Angular versions",
          de: "Angular-Versionen"
        }
      },
      {
        value: "0",
        label: {
          en: "days of feature freeze",
          de: "Tage Feature-Freeze"
        }
      }
    ]
  },
  {
    slug: "paidopsy",
    year: "2019",
    client: {
      en: "Freelance · paidopsy-trikala.gr",
      de: "Freelance · paidopsy-trikala.gr"
    },
    role: {
      en: "Designer · developer · hosting",
      de: "Design · Entwicklung · Hosting"
    },
    title: {
      en: "paidopsy-trikala.gr: custom WordPress site",
      de: "paidopsy-trikala.gr: individuelle WordPress-Website"
    },
    outcome: {
      en: "Designed and built a completely custom WordPress theme, and set up hosting, domain and email end to end.",
      de: "Komplett individuelles WordPress-Theme entworfen und umgesetzt, dazu Hosting, Domain und E-Mail von Grund auf eingerichtet."
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
      de: "Eine komplett neue Praxis ohne Webauftritt. Dies war ihre erste Website."
    },
    approach: {
      en: "Designed the site and built a completely custom WordPress theme. Set up the whole infrastructure: hosting, domain, DNS and email.",
      de: "Design der Website und Entwicklung eines komplett individuellen WordPress-Themes. Einrichtung der gesamten Infrastruktur: Hosting, Domain, DNS und E-Mail."
    },
    result: {
      en: "Lighthouse (desktop): 98 Performance, 96 Accessibility, 100 Best Practices, 100 SEO.",
      de: "Lighthouse (Desktop): 98 Performance, 96 Barrierefreiheit, 100 Best Practices, 100 SEO."
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
          de: "Live-Seite"
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
      de: "Freelance · Nuvé Apartment"
    },
    role: {
      en: "Design · development",
      de: "Design · Entwicklung"
    },
    title: {
      en: "Nuvé Apartment: holiday apartment showcase",
      de: "Nuvé Apartment: Showcase für eine Ferienwohnung"
    },
    outcome: {
      en: "Showcase site built from scratch with AI-assisted design. The visibility it created led to a nearly 100% occupancy rate.",
      de: "Showcase-Website von Grund auf mit KI-gestütztem Design gebaut. Die gewonnene Sichtbarkeit führte zu einer Auslastung von nahezu 100 %."
    },
    tags: [
      "AI-assisted design",
      "Vercel",
      "Responsive",
      "Multilingual"
    ],
    problem: {
      en: "A holiday apartment without its own web presence needed visibility to attract guests.",
      de: "Eine Ferienwohnung ohne eigenen Webauftritt brauchte Sichtbarkeit, um Gäste zu gewinnen."
    },
    approach: {
      en: "Created the site from scratch, using AI-assisted design to move quickly from concept to a finished showcase.",
      de: "Website von Grund auf erstellt, mit KI-gestütztem Design für den schnellen Weg vom Konzept zum fertigen Showcase."
    },
    result: {
      en: "Nearly 100% occupancy, driven by the visibility the site created.",
      de: "Nahezu 100 % Auslastung dank der Sichtbarkeit durch die Website."
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
          de: "Showcase"
        }
      }
    ]
  },
  {
    slug: "nonomo",
    year: "2016 – 2019",
    client: {
      en: "Nonomella GmbH · nonomo.de",
      de: "Nonomella GmbH · nonomo.de"
    },
    role: {
      en: "Intern → lead developer → Head of IT",
      de: "Praktikant → Lead-Entwickler → Leiter IT"
    },
    title: {
      en: "nonomo.de: from intern to shop relaunch",
      de: "nonomo.de: vom Praktikum zum Shop-Relaunch"
    },
    outcome: {
      en: "Three stages: started as an intern, led frontend and backend on the first upgrade, then the full overhaul with a custom configurator and a modern, responsive design.",
      de: "Drei Etappen: Einstieg als Praktikant, Frontend und Backend beim ersten Upgrade, dann die komplette Überarbeitung mit individuellem Konfigurator und modernem, responsivem Design."
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
      de: "2016: Einstieg als Praktikant am bestehenden Shop. Herbst 2016: erstes Upgrade als Haupt-Entwickler für Frontend und Backend. 2019: als Leiter IT die komplette Überarbeitung mit individuellem Produktkonfigurator und modernem, vollständig responsivem Design."
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
          de: "Start · Praktikum"
        },
        url: "https://web.archive.org/web/20160808023237/https://www.nonomo.de/"
      },
      {
        year: "2016",
        label: {
          en: "First upgrade",
          de: "Erstes Upgrade"
        },
        url: "https://web.archive.org/web/20161006000606/https://www.nonomo.de/"
      },
      {
        year: "2019",
        label: {
          en: "Relaunch",
          de: "Relaunch"
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
      de: "Nonomella GmbH · fidella.org"
    },
    role: {
      en: "Head of IT · lead developer",
      de: "Leiter IT · Lead-Entwickler"
    },
    title: {
      en: "fidella.org: purchase advisor & modernisation",
      de: "fidella.org: Kaufberater & Modernisierung"
    },
    outcome: {
      en: "Built an interactive purchase advisor and modernised the shop.",
      de: "Interaktiven Kaufberater entwickelt und den Shop modernisiert."
    },
    tags: [
      "JTL Shop",
      "PHP",
      "JavaScript",
      "Responsive"
    ],
    approach: {
      en: "Implemented a purchase advisor that guides customers to the right product, and modernised the shop design.",
      de: "Umsetzung eines Kaufberaters, der Kunden zum passenden Produkt führt, und Modernisierung des Shop-Designs."
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
          de: "Vorher"
        },
        url: "https://web.archive.org/web/20160229103848/https://fidella.org/"
      },
      {
        year: "2019",
        label: {
          en: "Modernised",
          de: "Modernisiert"
        },
        url: "https://web.archive.org/web/20190818065410/https://fidella.org/"
      }
    ]
  }
];
