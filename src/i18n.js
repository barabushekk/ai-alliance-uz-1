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
                "groups": "Working Groups",
                "knowledge": "Knowledge Base",
                "news": "News",
                "join": "Join Alliance"
            },
            "footer": {
                "rights": "All rights reserved.",
                "contact": "Contact Us",
                "address": "Tashkent, Uzbekistan"
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
                "groups": "Рабочие группы",
                "knowledge": "База знаний",
                "news": "Новости",
                "join": "Вступить"
            },
            "footer": {
                "rights": "Все права защищены.",
                "contact": "Контакты",
                "address": "Ташкент, Узбекистан"
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
                "groups": "Ishchi guruhlar",
                "knowledge": "Bilimlar bazasi",
                "news": "Yangiliklar",
                "join": "Qo'shilish"
            },
            "footer": {
                "rights": "Barcha huquqlar himoyalangan.",
                "contact": "Bog'lanish",
                "address": "Toshkent, O'zbekiston"
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
