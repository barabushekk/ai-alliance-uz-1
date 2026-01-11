-- Create tables for Partners page

-- 1. Sections
CREATE TABLE IF NOT EXISTS partners_sections (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    title_uz TEXT,
    description_uz TEXT,
    title_en TEXT,
    description_en TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Strategic Partners
CREATE TABLE IF NOT EXISTS partners_strategic (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    category TEXT,
    role TEXT,
    description TEXT,
    logo TEXT, -- Text for now as in current UI
    name_uz TEXT,
    category_uz TEXT,
    role_uz TEXT,
    description_uz TEXT,
    name_en TEXT,
    category_en TEXT,
    role_en TEXT,
    description_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Partner Categories (Ecosystem)
CREATE TABLE IF NOT EXISTS partners_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    icon TEXT DEFAULT 'Building2',
    title_uz TEXT,
    title_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Partners within Categories
CREATE TABLE IF NOT EXISTS partners_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES partners_categories(id) ON DELETE CASCADE,
    name TEXT,
    location TEXT,
    name_uz TEXT,
    location_uz TEXT,
    name_en TEXT,
    location_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Benefits
CREATE TABLE IF NOT EXISTS partners_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon TEXT DEFAULT 'Handshake',
    title TEXT,
    description TEXT,
    title_uz TEXT,
    description_uz TEXT,
    title_en TEXT,
    description_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE partners_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners_strategic ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners_benefits ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access on partners_sections" ON partners_sections FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on partners_strategic" ON partners_strategic FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on partners_categories" ON partners_categories FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on partners_list" ON partners_list FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on partners_benefits" ON partners_benefits FOR SELECT TO public USING (true);

-- Authenticated management
CREATE POLICY "Allow authenticated users to manage partners_sections" ON partners_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage partners_strategic" ON partners_strategic FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage partners_categories" ON partners_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage partners_list" ON partners_list FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage partners_benefits" ON partners_benefits FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Initial Seed Data
INSERT INTO partners_sections (key, title, description) VALUES 
('hero', 'Партнеры', 'Сообщество лидеров, формирующих цифровой суверенитет Узбекистана через развитие экосистемы искусственного интеллекта.'),
('strategic_header', 'Стратегические партнеры', 'Ключевые организации, обеспечивающие технологическую основу Альянса'),
('ecosystem_header', 'Экосистема Альянса', 'Партнеры по направлениям деятельности'),
('benefits_header', 'Преимущества партнерства', 'Что получают участники Альянса'),
('cta', 'Станьте частью Альянса', 'Мы открыты для новых партнерств с инновационными компаниями, исследовательскими центрами и образовательными учреждениями.');

INSERT INTO partners_strategic (name, category, role, description, logo, sort_order) VALUES 
('Uztelecom', 'Государственные компании', 'Технологическая инфраструктура', 'Обеспечение высокоскоростной передачи данных и облачных вычислений для ИИ-проектов национального масштаба.', 'UT', 1),
('EPAM Uzbekistan', 'Технологические гиганты', 'Инженерная экспертиза', 'Поддержка в разработке сложных программных решений и обучение высококвалифицированных ИТ-специалистов.', 'EP', 2),
('Ucell', 'Телекоммуникации', 'Мобильные инновации', 'Внедрение 5G технологий и развитие сервисов на базе искусственного интеллекта.', 'UC', 3);

-- Temporary ID variable trick for seeding linked tables in psql won't work easily here, 
-- but we can seed categories and then partners will follow.
-- For this script, we'll just seed categories.

INSERT INTO partners_categories (id, title, icon, sort_order) VALUES 
('11111111-1111-1111-1111-111111111111', 'Образование и Наука', 'GraduationCap', 1),
('22222222-2222-2222-2222-222222222222', 'Технологические парки', 'Network', 2),
('33333333-3333-3333-3333-333333333333', 'Государственный сектор', 'Building2', 3);

INSERT INTO partners_list (category_id, name, location, sort_order) VALUES 
('11111111-1111-1111-1111-111111111111', 'Inha University', 'Ташкент', 1),
('11111111-1111-1111-1111-111111111111', 'Amity University', 'Ташкент', 2),
('11111111-1111-1111-1111-111111111111', 'WIUT', 'Ташкент', 3),
('11111111-1111-1111-1111-111111111111', 'TUIT', 'Ташкент', 4),
('22222222-2222-2222-2222-222222222222', 'IT Park Uzbekistan', 'Национальный охват', 1),
('22222222-2222-2222-2222-222222222222', 'Astrum Academy', 'Ташкентская область', 2),
('22222222-2222-2222-2222-222222222222', 'Digital City', 'Андижан', 3),
('33333333-3333-3333-3333-333333333333', 'Министерство Цифровых Технологий', 'Узбекистан', 1),
('33333333-3333-3333-3333-333333333333', 'Центр ИИ (Digital Uzbekistan)', 'Ташкент', 2);

INSERT INTO partners_benefits (title, description, icon, sort_order) VALUES 
('Совместные исследования', 'Доступ к научно-исследовательским работам и участие в создании новых продуктов на базе ИИ.', 'Handshake', 1),
('Инфраструктура', 'Приоритетный доступ к государственным дата-сетам и вычислительным кластерам.', 'Zap', 2),
('Экспертное сообщество', 'Участие в закрытых мероприятиях, форумах и рабочих группах по развитию ИИ.', 'Users', 3);
