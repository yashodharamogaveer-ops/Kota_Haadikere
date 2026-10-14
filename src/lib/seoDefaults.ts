// Built-in SEO text for each page (admin overrides come from the seo_pages table)
export function getDefaultSeo(currentPage: string, lang: 'kn' | 'en') {
    if (lang === 'kn') {
      switch (currentPage) {
        case 'about':
          return {
            title: "ಕ್ಷೇತ್ರದ ಹಿನ್ನೆಲೆ ಮತ್ತು ಇತಿಹಾಸ - ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಬ್ರಹ್ಮಾವರದ ಹಾಡಿಕೆರೆಯಲ್ಲಿ ನೆಲೆಸಿರುವ ಶಾಂತಮೂರ್ತಿ ಶನೀಶ್ವರ ಸ್ವಾಮಿಯ ಇತಿಹಾಸ ಮತ್ತು ಹಿನ್ನೆಲೆ. ಜಾತಕ ದೋಷ ನಿವಾರಣೆಗಾಗಿ ಎಳ್ಳೆಣ್ಣೆ ದೀಪಗಳ ಆರಾಧನೆ.",
            keywords: "ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಇತಿಹಾಸ, ಹಾಡಿಕೆರೆ, ಬ್ರಹ್ಮಾವರ, ಉಡುಪಿ, ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಕಲ್ಯಾಣ ಮಂಟಪ, ಧರ್ಮಸ್ಥಳ",
          };
        case 'gallery':
          return {
            title: "ಪವಿತ್ರ ಚಿತ್ರಸಂಪುಟ ಮತ್ತು ವೀಡಿಯೊಗಳು - ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ಸುಂದರ ಫೋಟೋಗಳು ಮತ್ತು ವೀಡಿಯೊಗಳ ಗ್ಯಾಲರಿ. ಮಹಾ ಪೂಜೆ, ದೀಪಾರಾಧನೆ ಮತ್ತು ಹಸಿರು ಪರಿಸರ.",
            keywords: "ಚಿತ್ರಸಂಪುಟ, ಫೋಟೋಗಳು, ವೀಡಿಯೊಗಳು, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ ಗ್ಯಾಲರಿ, ಪೂಜೆ",
          };
        case 'seva':
          return {
            title: "ಸೇವೆಗಳು ಮತ್ತು ವಿಶೇಷ ಪೂಜೆಗಳ ವಿವರ - ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆಯಲ್ಲಿ ನಡೆಯುವ ವಿಶೇಷ ಸೇವೆಗಳು, ತೈಲಾಭಿಷೇಕ ಮತ್ತು ಪೂಜೆಗಳ ವಿವರಗಳು.",
            keywords: "ಸೇವೆಗಳು, ಪೂಜೆಗಳು, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ತೈಲಾಭಿಷೇಕ, ಸಂಕಲ್ಪ, ಸೇವಾ ಪಟ್ಟಿ",
          };
        case 'contact':
          return {
            title: "ಸಂಪರ್ಕ ಮಾಹಿತಿ, ವಿಳಾಸ ಮತ್ತು ಮಾರ್ಗಸೂಚಿ - ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಹಾಡಿಕೆರೆ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ವಿಳಾಸ, ಫೋನ್ ಸಂಖ್ಯೆಗಳು, ಸಂಪರ್ಕ ಫಾರ್ಮ್ ಮತ್ತು ಗೂಗಲ್ ಮ್ಯಾಪ್ ಮೂಲಕ ದೇವಸ್ಥಾನ ತಲುಪುವ ಮಾರ್ಗಸೂಚಿಗಳು.",
            keywords: "ಸಂಪರ್ಕ, ವಿಳಾಸ, ಫೋನ್ ಸಂಖ್ಯೆ, ನಕ್ಷೆ, ಹಾಡಿಕೆರೆ ಮಾರ್ಗ, ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್, ಬ್ರಹ್ಮಾವರ ವಿಳಾಸ",
          };
        case 'privacy':
          return {
            title: "ಗೌಪ್ಯತಾ ನೀತಿ - ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ಅಧಿಕೃತ ಗೌಪ್ಯತಾ ನೀತಿ. ಭಕ್ತಾದಿಗಳ ಪವಿತ್ರ ಮಾಹಿತಿ ರಕ್ಷಣೆ ಮತ್ತು ಬದ್ಧತೆ.",
            keywords: "ಗೌಪ್ಯತಾ ನೀತಿ, ಭಕ್ತರ ರಕ್ಷಣೆ, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ, ಗೌಪ್ಯತೆ",
          };
        case 'notfound':
          return {
            title: "ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ (404) - ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಕ್ಷಮಿಸಿ, ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟವು ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಬದಲಾಗಿದೆ. ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ.",
            keywords: "404, ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ",
          };
        case 'home':
        default:
          return {
            title: "ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ",
            description: "ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಬ್ರಹ್ಮಾವರ ತಾಲೂಕಿನ ಪ್ರಶಾಂತ ಗ್ರಾಮವಾದ ಹಾಡಿಕೆರೆಯ ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನಕ್ಕೆ ತಮಗೆ ಆದರದ ಸ್ವಾಗತ. ದೇವಸ್ಥಾನದ ಇತಿಹಾಸ, ಸಮಯಗಳು ಮತ್ತು ಸೇವೆಗಳ ಮಾಹಿತಿ.",
            keywords: "ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ, ಬ್ರಹ್ಮಾವರ, ಉಡುಪಿ, ಮುಖಪುಟ, ಶನಿ ಪೂಜೆ, ದರ್ಶನ ಸಮಯ, ಅನ್ನದಾಸೋಹ",
          };
      }
    } else {
      switch (currentPage) {
        case 'about':
          return {
            title: "Temple Sanctuary & Holy History - Shantamurthy Sri Shaneshwara Temple | Haadikere",
            description: "Learn about the history and sacred significance of the Peaceful Lord Shaneshwara (Shantamurthy) in Udupi. Light Ellu Bathi (sesame oil lamps) and seek relief from Shani Dosha.",
            keywords: "About Temple, History, Shantamurthy, Lord Shaneshwara, Haadikere, Udupi, Shani Dosha, Ellu Bathi",
          };
        case 'gallery':
          return {
            title: "Sacred Media Gallery & Videos - Shantamurthy Sri Shaneshwara Temple | Haadikere",
            description: "View beautiful photographs and videos of Shantamurthy Sri Shaneshwara Temple, including the sacred shrine, festive pujas, and lush green surroundings.",
            keywords: "Gallery, Photos, Videos, Holy Shrine, Pujas, Haadikere Gallery, Temple Pictures, South Indian Temple",
          };
        case 'seva':
          return {
            title: "Holy Seva Offerings & Poojas - Sri Shaneshwara Temple | Haadikere",
            description: "View details of special sevas, poojas, and tailabhisheka at Haadikere. Direct counter seva offerings.",
            keywords: "Seva, Poojas, Shani Puja, Tailabhisheka, Sankalpa, Sacred Blessings",
          };
        case 'contact':
          return {
            title: "Contact Information, Route Map & Directions - Sri Shaneshwara Temple | Haadikere",
            description: "Find temple address, phone numbers, contact form, and Google Maps direction to Shantamurthy Sri Shaneshwara Temple, Haadikere, Brahmavara Taluk, Udupi.",
            keywords: "Contact, Address, Phone, Google Maps, Location, Direction, Haadikere Brahmavara, Brahmavara Road Map",
          };
        case 'privacy':
          return {
            title: "Privacy Policy - Shantamurthy Sri Shaneshwara Temple | Haadikere",
            description: "Official Privacy Policy of Shantamurthy Sri Shaneshwara Temple, Sri Kshetra Haadikere. Devotee data protection, confidentiality, and sacred trust.",
            keywords: "Privacy Policy, Devotee Privacy, Shaneshwara Temple, Haadikere, Data Protection, Trust Policy",
          };
        case 'notfound':
          return {
            title: "Page Not Found (404) - Shantamurthy Sri Shaneshwara Temple | Haadikere",
            description: "Sorry, the page you are looking for does not exist or has been moved. Return to the homepage of Sri Shaneshwara Temple.",
            keywords: "404, Page Not Found, Shaneshwara Temple, Haadikere",
          };
        case 'home':
        default:
          return {
            title: "Shantamurthy Sri Shaneshwara Temple | Sri Kshetra Haadikere, Udupi",
            description: "Welcome to Shantamurthy Sri Shaneshwara Temple at Haadikere, Udupi. Explore sevas, timings, kalyana mantapa, and holy sanctuary history.",
            keywords: "Sri Shaneshwara Temple, Haadikere, Udupi, Home, Darshan Timings, Shani Dev, Shantamurthy",
          };
      }
    }
}
