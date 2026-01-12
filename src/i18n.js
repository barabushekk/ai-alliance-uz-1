import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation Resources
const resources = {
    en: {
        translation: {
            "nav": {
                "home": "Home",
                "about": "About",
                "participants": "Participants",
                "partners": "Partners",
                "projects": "Projects",
                "groups": "Committees",
                "knowledge": "Knowledge Base",
                "news": "News",
                "join": "Join Alliance"
            },
            "footer": {
                "rights": "All rights reserved.",
                "contact": "Contact Us",
                "contacts": "Contacts",
                "address": "Tashkent, Uzbekistan",

                "navigation": "Navigation",
                "resources": "Resources"
            },
            "about_page": {
                "values_title": "Our Values",
                "values_subtitle": "Principles on which our work is built"
            },
            "admin": {
                "dashboard": "Dashboard",
                "about": "About Page",
                "participants": "Participants",
                "projects": "Projects",
                "settings": "Settings",
                "logout": "Log Out",
                "welcome": "Welcome back",
                "total_projects": "Total Projects",
                "partners_count": "Partners",
                "system_status": "System Status",
                "active": "Active",
                "recent_activity": "Recent Activity"
            },
            "home_page": {
                "about_tag": "ABOUT US",
                "projects_tag": "INITIATIVES",
                "groups_tag": "COMMITTEES",
                "advantages_tag": "KEY ADVANTAGES",
                "all_projects": "All projects"
            },
            "participants_page": {
                "formats_tag": "FORMATS",
                "criteria_tag": "CRITERIA"
            }
        }
    },
    ru: {
        translation: {
            "nav": {
                "home": "Главная",
                "about": "Об Альянсе",
                "participants": "Участники",
                "partners": "Партнеры",
                "projects": "Проекты",
                "groups": "Комитеты",
                "knowledge": "База знаний",
                "news": "Новости",
                "join": "Вступить"
            },
            "footer": {
                "rights": "Все права защищены.",
                "contact": "Контакты",
                "contacts": "Контакты",
                "address": "Ташкент, Узбекистан",

                "navigation": "Навигация",
                "resources": "Ресурсы"
            },
            "about_page": {
                "values_title": "Наши Ценности",
                "values_subtitle": "Принципы, на которых строится наша работа"
            },
            "admin": {
                "dashboard": "Дашборд",
                "about": "Редактор 'О нас'",
                "participants": "Участники",
                "projects": "Проекты",
                "settings": "Настройки",
                "logout": "Выйти",
                "welcome": "С возвращением",
                "total_projects": "Всего проектов",
                "partners_count": "Партнеры",
                "system_status": "Статус системы",
                "active": "Активен",
                "recent_activity": "Последняя активность"
            },
            "home_page": {
                "about_tag": "О НАС",
                "projects_tag": "ИНИЦИАТИВЫ",
                "groups_tag": "КОМИТЕТЫ",
                "advantages_tag": "КЛЮЧЕВЫЕ ПРЕИМУЩЕСТВА",
                "all_projects": "Все проекты"
            },
            "participants_page": {
                "formats_tag": "ФОРМАТЫ",
                "criteria_tag": "КРИТЕРИИ"
            }
        }
    },
    uz: {
        translation: {
            "nav": {
                "home": "Bosh sahifa",
                "about": "Alyans haqida",
                "participants": "Ishtirokchilar",
                "partners": "Hamkorlar",
                "projects": "Loyihalar",
                "groups": "Qo'mitalar",
                "knowledge": "Bilimlar bazasi",
                "news": "Yangiliklar",
                "join": "Qo'shilish"
            },
            "footer": {
                "rights": "Barcha huquqlar himoyalangan.",
                "contact": "Bog'lanish",
                "contacts": "Kontaktlar",
                "address": "Toshkent, O'zbekiston",

                "navigation": "Navigatsiya",
                "resources": "Resurslar"
            },
            "about_page": {
                "values_title": "Bizning Qadriyatlarimiz",
                "values_subtitle": "Bizning ishimiz asoslangan tamoyillar"
            },
            "admin": {
                "dashboard": "Boshqaruv paneli",
                "about": "Biz haqimizda",
                "participants": "Ishtirokchilar",
                "projects": "Loyihalar",
                "settings": "Sozlamalar",
                "logout": "Chiqish",
                "welcome": "Xush kelibsiz",
                "total_projects": "Jami loyihalar",
                "partners_count": "Hamkorlar",
                "system_status": "Tizim holati",
                "active": "Faol",
                "recent_activity": "So'nggi faollik"
            },
            "home_page": {
                "about_tag": "BIZ HAQIMIZDA",
                "projects_tag": "TASHABBUSLAR",
                "groups_tag": "QO'MITALAR",
                "advantages_tag": "ASOSIY AFZALLIKLAR",
                "all_projects": "Barcha loyihalar"
            },
            "participants_page": {
                "formats_tag": "FORMATLAR",
                "criteria_tag": "MEZONLAR"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'ru', // Default to Russian as per context
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
