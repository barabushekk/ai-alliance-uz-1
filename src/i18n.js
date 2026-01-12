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
                "all_projects": "All projects",
                "news_title": "Recent News",
                "news_subtitle": "Stay informed about the latest AI breakthroughs and Alliance updates",
                "news_tag": "NEWS",
                "all_news": "All News",
                "no_news_yet": "News coming soon..."
            },
            "participants_page": {
                "formats_tag": "FORMATS",
                "criteria_tag": "CRITERIA"
            },
            "modal": {
                "membership_title": "Membership Application",
                "partner_title": "Become a Partner",
                "committee_title": "Committee Application",
                "knowledge_title": "Your Suggestion",
                "default_title": "Participant Form",
                "subtitle": "Leave your contact details, and we will contact you shortly.",
                "full_name": "Full Name",
                "full_name_placeholder": "John Doe",
                "organization": "Organization",
                "organization_placeholder": "Your Company Name",
                "email": "Email",
                "email_placeholder": "example@mail.com",
                "phone": "Phone",
                "phone_placeholder": "+998 (__) ___-__-__",
                "message": "Comment (optional)",
                "message_placeholder": "Your question or message...",
                "submit": "Submit Application",
                "success_title": "Application Sent!",
                "success_message": "Thank you for your interest in the Alliance. We will contact you shortly.",
                "error_message": "Error while sending. Please try again later."
            },
            "news_page": {
                "hero_title": "News and Events",
                "hero_desc": "Stay up to date with the most important events and news in the field of artificial intelligence in Uzbekistan.",
                "latest_title": "Latest News",
                "latest_desc": "Current information on the development of the AI ecosystem",
                "read_more": "Read More",
                "learn_more": "Learn More"
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
                "all_projects": "Все проекты",
                "news_title": "Последние новости",
                "news_subtitle": "Следите за самыми важными событиями в области ИИ и деятельности Альянса",
                "news_tag": "НОВОСТИ",
                "all_news": "Все новости",
                "no_news_yet": "Новости скоро появятся..."
            },
            "participants_page": {
                "formats_tag": "ФОРМАТЫ",
                "criteria_tag": "КРИТЕРИИ"
            },
            "modal": {
                "membership_title": "Заявка на вступление",
                "partner_title": "Стать партнером",
                "committee_title": "Заявка в комитет",
                "knowledge_title": "Ваше предложение",
                "default_title": "Анкета участника",
                "subtitle": "Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время.",
                "full_name": "ФИО",
                "full_name_placeholder": "Иванов Иван Иванович",
                "organization": "Организация",
                "organization_placeholder": "Название вашей компании",
                "email": "Email",
                "email_placeholder": "example@mail.com",
                "phone": "Телефон",
                "phone_placeholder": "+998 (__) ___-__-__",
                "message": "Комментарий (необязательно)",
                "message_placeholder": "Ваш вопрос или сообщение...",
                "submit": "Отправить заявку",
                "success_title": "Заявка отправлена!",
                "success_message": "Спасибо за интерес к Альянсу. Мы свяжемся с вами в ближайшее время.",
                "error_message": "Ошибка при отправке. Попробуйте позже."
            },
            "news_page": {
                "hero_title": "Новости и События",
                "hero_desc": "Будьте в курсе самых важных событий и новостей в области искусственного интеллекта в Узбекистане.",
                "latest_title": "Последние новости",
                "latest_desc": "Актуальная информация о развитии ИИ-экосистемы",
                "read_more": "Читать полностью",
                "learn_more": "Подробнее"
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
                "all_projects": "Barcha loyihalar",
                "news_title": "So'nggi yangiliklar",
                "news_subtitle": "AI sohasidagi eng muhim voqealar va Alyans faoliyatini kuzatib boring",
                "news_tag": "YANGILIKLAR",
                "all_news": "Barcha yangiliklar",
                "no_news_yet": "Yangiliklar tez orada..."
            },
            "participants_page": {
                "formats_tag": "FORMATLAR",
                "criteria_tag": "MEZONLAR"
            },
            "modal": {
                "membership_title": "A'zo bo'lish uchun ariza",
                "partner_title": "Hamkor bo'lish",
                "committee_title": "Qo'mitaga ariza",
                "knowledge_title": "Sizning taklifingiz",
                "subtitle": "Aloqa ma'lumotlaringizni qoldiring va biz tez orada siz bilan bog'lanamiz.",
                "full_name": "F.I.O.",
                "full_name_placeholder": "Ivanov Ivan Ivanovich",
                "organization": "Tashkilot",
                "organization_placeholder": "Kompaniyangiz nomi",
                "email": "Email",
                "email_placeholder": "example@mail.com",
                "phone": "Telefon",
                "phone_placeholder": "+998 (__) ___-__-__",
                "message": "Izoh (ixtiyoriy)",
                "message_placeholder": "Sizning savolingiz yoki xabaringiz...",
                "submit": "Ariza yuborish",
                "success_title": "Ariza yuborildi!",
                "success_message": "Alyansga bo'lgan qiziqishingiz uchun rahmat. Biz tez orada siz bilan bog'lanamiz.",
                "error_message": "Yuborishda xatolik yuz berdi. Keyinroq qayta urinib ko'ring."
            },
            "news_page": {
                "hero_title": "Yangiliklar va tadbirlar",
                "hero_desc": "O‘zbekistonda Sun’iy Intellekt sohasidagi eng muhim tadbirlar va yangiliklardan xabardor bo‘lib boring.",
                "latest_title": "So'nggi yangiliklar",
                "latest_desc": "AI ekotizimining rivojlanishi haqidagi dolzarb ma'lumotlar",
                "read_more": "Batafsil",
                "learn_more": "Batafsil"
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
