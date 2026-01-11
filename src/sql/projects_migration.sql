-- Create tables for Projects page

-- 1. Sections (Hero, Stats Header, Projects Header, CTA)
CREATE TABLE IF NOT EXISTS projects_sections (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    title_uz TEXT,
    description_uz TEXT,
    title_en TEXT,
    description_en TEXT,
    cta_text TEXT,
    cta_text_uz TEXT,
    cta_text_en TEXT,
    cta_link TEXT DEFAULT '#',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Project Stats
CREATE TABLE IF NOT EXISTS projects_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    value TEXT,
    label TEXT,
    value_uz TEXT,
    label_uz TEXT,
    value_en TEXT,
    label_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Project Items
CREATE TABLE IF NOT EXISTS projects_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    description TEXT,
    status TEXT,
    timeline TEXT,
    team TEXT,
    impact TEXT,
    tags TEXT, -- Comma separated or JSON
    image_url TEXT,
    
    title_uz TEXT,
    description_uz TEXT,
    status_uz TEXT,
    timeline_uz TEXT,
    team_uz TEXT,
    impact_uz TEXT,
    tags_uz TEXT,
    
    title_en TEXT,
    description_en TEXT,
    status_en TEXT,
    timeline_en TEXT,
    team_en TEXT,
    impact_en TEXT,
    tags_en TEXT,
    
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public Read Projects Sections" ON projects_sections FOR SELECT USING (true);
CREATE POLICY "Public Read Projects Stats" ON projects_stats FOR SELECT USING (true);
CREATE POLICY "Public Read Projects Items" ON projects_items FOR SELECT USING (true);

-- Authenticated management
CREATE POLICY "Auth Manage Projects Sections" ON projects_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Manage Projects Stats" ON projects_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Manage Projects Items" ON projects_items FOR ALL USING (auth.role() = 'authenticated');

-- Initial Seed Data
INSERT INTO projects_sections (key, title, description, title_uz, description_uz, title_en, description_en)
VALUES 
('hero', 'Проекты и Инициативы', 'Флагманские проекты Альянса, направленные на технологический прорыв и цифровую трансформацию Узбекистана.', 'Loyihalar va Tashabbuslar', 'Alyansning flagman loyihalari, O''zbekistonning texnologik yutug''i va raqamli transformatsiyasiga qaratilgan.', 'Projects and Initiatives', 'Flagship projects of the Alliance aimed at technological breakthrough and digital transformation of Uzbekistan.'),
('projects_header', 'Флагманские проекты', 'Ключевые инициативы, формирующие будущее ИИ в Узбекистане', 'Flagman loyihalar', 'O''zbekistonda sun''iy intellekt kelajagini shakllantiradigan asosiy tashabbuslar', 'Flagship Projects', 'Key initiatives shaping the future of AI in Uzbekistan'),
('cta', 'Есть идея проекта?', 'Мы всегда открыты для новых инициатив в области искусственного интеллекта. Предложите свой проект и станьте частью технологической революции.', 'Loyiha g''oyasi bormi?', 'Biz har doim sun''iy intellekt sohasidagi yangi tashabbuslar uchun ochiqmiz. O''z loyihangizni taklif qiling va texnologik inqilobning bir qismiga aylaning.', 'Have a project idea?', 'We are always open to new initiatives in the field of artificial intelligence. Propose your project and become part of the technological revolution.');

UPDATE projects_sections 
SET cta_text = 'Предложить проект', 
    cta_text_uz = 'Loyihani taklif qilish', 
    cta_text_en = 'Propose a project'
WHERE key = 'cta';

INSERT INTO projects_stats (value, label, value_uz, label_uz, value_en, label_en, sort_order)
VALUES 
('12+', 'Активных проектов', '12+', 'Aktiv loyihalar', '12+', 'Active projects', 1),
('50+', 'Партнерских организаций', '50+', 'Hamkor tashkilotlar', '50+', 'Partner organizations', 2),
('100K+', 'Бенефициаров', '100K+', 'Benefitsiarlar', '100K+', 'Beneficiaries', 3),
('$5M+', 'Инвестиций', '$5M+', 'Investitsiyalar', '$5M+', 'Investments', 4);

INSERT INTO projects_items (title, description, status, timeline, team, impact, tags, image_url, sort_order)
VALUES 
('Национальная стратегия ИИ', 'Участие в разработке комплексной дорожной карты развития искусственного интеллекта в Узбекистане до 2030 года.', 'В процессе', '2024-2030', '15+ экспертов', 'Национальный масштаб', 'Госрегулирование, Стратегия, Политика', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80', 1),
('AI Education Hub', 'Создание комплексной образовательной платформы для подготовки специалистов по Data Science, Machine Learning и AI.', 'Запущено', '2023-2026', '25+ преподавателей', '5000+ студентов', 'Образование, Таланты, E-Learning', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80', 2);
