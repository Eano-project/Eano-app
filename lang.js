// lang.js
// Language management module for EANO Project

// Language data object with translations
const translations = {
  en: {
    welcomeTitle: "👋 Welcome to EANO",
    welcomeMessage: "Your mobile-first crypto experience built for everyday users.",
    skipButton: "Skip Introduction",
    getStarted: "Get Started",
    toggleTheme: "🌗 Toggle Light/Dark",
    langSelect: "🌍 Select Language"
  },
  fr: {
    welcomeTitle: "👋 Bienvenue chez EANO",
    welcomeMessage: "Votre expérience crypto mobile conçue pour les utilisateurs quotidiens.",
    skipButton: "Passer l'introduction",
    getStarted: "Commencer",
    toggleTheme: "🌗 Basculer Clair/Sombre",
    langSelect: "🌍 Choisir la langue"
  },
  sw: {
    welcomeTitle: "👋 Karibu EANO",
    welcomeMessage: "Uzoefu wako wa kwanza wa crypto ulioundwa kwa watumiaji wa kila siku.",
    skipButton: "Ruka Utangulizi",
    getStarted: "Anza",
    toggleTheme: "🌗 Badilisha Mwanga/Giza",
    langSelect: "🌍 Chagua Lugha"
  },
  ig: {
    welcomeTitle: "👋 Nnọọ na EANO",
    welcomeMessage: "Ahụmahụ gị nke mbụ na crypto e mere maka ndị ọrụ kwa ụbọchị.",
    skipButton: "Wụga Nsonaazụ",
    getStarted: "Malite",
    toggleTheme: "🌗 Gbanwee Ìhè/Ọchịchịrị",
    langSelect: "🌍 Họrọ Asụsụ"
  },
  yo: {
    welcomeTitle: "👋 Kaabo si EANO",
    welcomeMessage: "Iriri rẹ ti akọkọ crypto ti a ṣe fun awọn olumulo lojoojumọ.",
    skipButton: "Fo Ifihan",
    getStarted: "Bẹrẹ",
    toggleTheme: "🌗 Yi Imọlẹ/Dudu Pada",
    langSelect: "🌍 Yan Ede"
  },
  ha: {
    welcomeTitle: "👋 Barka da Zuwa EANO",
    welcomeMessage: "Kwarewar ku ta farko ta crypto da aka kera don masu amfani na yau da kullun.",
    skipButton: "Tsallake Gabatarwa",
    getStarted: "Fara",
    toggleTheme: "🌗 Canja Haske/Duhu",
    langSelect: "🌍 Zaɓi Harshe"
  },
  efik: {
    welcomeTitle: "👋 Eyen EANO",
    welcomeMessage: "Ntre ke ufọk oro crypto emi enye ndi ama okodude ke ufọk.",
    skipButton: "Kpukpru Mfọñ",
    getStarted: "Mbọk",
    toggleTheme: "🌗 Mbuk Utom/Duop",
    langSelect: "🌍 Se Ekọd"
  },
  pid: {
    welcomeTitle: "👋 Welcome to EANO",
    welcomeMessage: "Your mobile-first crypto experience wey dem build for everyday pipo.",
    skipButton: "Skip Intro",
    getStarted: "Start Now",
    toggleTheme: "🌗 Change Light/Dark",
    langSelect: "🌍 Pick Language"
  },
  zh: {
    welcomeTitle: "👋 欢迎来到 EANO",
    welcomeMessage: "专为日常用户设计的移动优先加密货币体验。",
    skipButton: "跳过介绍",
    getStarted: "开始",
    toggleTheme: "🌗 切换明暗",
    langSelect: "🌍 选择语言"
  }
};

// Default language
let currentLang = 'en';

// Function to set language
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  // Update UI elements
  const welcomeTitle = document.querySelector('.welcome-container h1');
  const welcomeMessage = document.querySelector('.welcome-container p');
  const skipBtn = document.getElementById('skip-btn');
  const getStartedBtn = document.getElementById('get-started');
  const themeToggle = document.getElementById('theme-toggle');
  const langSelect = document.getElementById('lang-select');

  if (welcomeTitle) welcomeTitle.textContent = translations[lang].welcomeTitle;
  if (welcomeMessage) welcomeMessage.textContent = translations[lang].welcomeMessage;
  if (skipBtn) skipBtn.textContent = translations[lang].skipButton;
  if (getStartedBtn) getStartedBtn.textContent = translations[lang].getStarted;
  if (themeToggle) themeToggle.textContent = translations[lang].toggleTheme;
  if (langSelect) {
    langSelect.value = lang;
    langSelect.querySelector(`option[value="${lang}"]`).selected = true;
  }

  // Handle RTL for Hausa if needed (optional, can be extended)
  if (lang === 'ha') {
    document.body.style.direction = 'rtl';
  } else {
    document.body.style.direction = 'ltr';
  }
}

// Auto-detect language from browser
function detectLanguage() {
  const navLang = navigator.language || navigator.userLanguage;
  const supportedLangs = Object.keys(translations);
  const userLang = navLang.split('-')[0].toLowerCase();

  return supportedLangs.includes(userLang) ? userLang : 'en';
}

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
  // Check saved language or detect
  const savedLang = localStorage.getItem('lang');
  const initialLang = savedLang || detectLanguage();
  setLanguage(initialLang);

  // Language selector event
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
});

// Export for use in other modules (if needed)
export { setLanguage, translations, currentLang };
