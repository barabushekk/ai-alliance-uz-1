-- Create tables for Participants page

-- 1. Sections (Hero, Features, Requirements header etc)
CREATE TABLE IF NOT EXISTS participants_sections (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    title_uz TEXT,
    description_uz TEXT,
    title_en TEXT,
    description_en TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Benefits
CREATE TABLE IF NOT EXISTS participants_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon TEXT DEFAULT 'CheckCircle',
    title TEXT,
    description TEXT,
    title_uz TEXT,
    description_uz TEXT,
    title_en TEXT,
    description_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Participation Types
CREATE TABLE IF NOT EXISTS participants_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon TEXT DEFAULT 'Building2',
    title TEXT,
    benefits_list TEXT, -- Newline separated
    title_uz TEXT,
    benefits_list_uz TEXT,
    title_en TEXT,
    benefits_list_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Requirements
CREATE TABLE IF NOT EXISTS participants_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    items_list TEXT, -- Newline separated
    title_uz TEXT,
    items_list_uz TEXT,
    title_en TEXT,
    items_list_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Steps (How to Join)
CREATE TABLE IF NOT EXISTS participants_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_num INTEGER,
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
ALTER TABLE participants_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants_steps ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access on participants_sections" ON participants_sections FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on participants_benefits" ON participants_benefits FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on participants_types" ON participants_types FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on participants_requirements" ON participants_requirements FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on participants_steps" ON participants_steps FOR SELECT TO public USING (true);

-- Authenticated management
CREATE POLICY "Allow authenticated users to manage participants_sections" ON participants_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage participants_benefits" ON participants_benefits FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage participants_types" ON participants_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage participants_requirements" ON participants_requirements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage participants_steps" ON participants_steps FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Initial Seed Data
INSERT INTO participants_sections (key, title, description) VALUES 
('hero', 'Стать Участником', 'Присоединяйтесь к экосистеме лидеров, определяющих будущее искусственного интеллекта в Узбекистане.'),
('benefits_header', 'Преимущества членства', ''),
('types_header', 'Типы участия', 'Выберите подходящий формат взаимодействия с Альянсом'),
('req_header', 'Условия и требования', ''),
('steps_header', 'Как вступить в Альянс?', '');

INSERT INTO participants_benefits (title, description, icon, sort_order) VALUES 
('Нетворкинг и Связи', 'Эксклюзивный доступ к закрытому сообществу экспертов, руководителей ИИ-компаний и представителям государства.', 'Users', 1),
('Влияние на Отрасль', 'Прямое участие в рабочих группах по формированию стратегии ИИ и нормативно-правовой базы.', 'Globe', 2),
('Ресурсы и Инфраструктура', 'Льготный доступ к вычислительным мощностям, национальным датасетам и технологическим платформам.', 'Zap', 3),
('Статус и Репутация', 'Позиционирование вашей компании как ключевого игрока технологической модернизации страны.', 'CheckCircle', 4);

INSERT INTO participants_types (title, icon, benefits_list, sort_order) VALUES 
('Бизнес', 'Building2', 'Доступ к платформе тестирования ИИ-моделей
Участие в формировании отраслевых стандартов
Приоритетный подбор ИТ-кадров', 1),
('Образование и Наука', 'GraduationCap', 'Гранты на исследовательские ИИ-проекты
Доступ к закрытым датасетам для обучения
Совместные лаборатории с тех-гигантами', 2),
('Гос. сектор', 'Globe', 'Экспертиза проектов цифровой трансформации
Подготовка кадров для госслужбы
Разработка этических норм применения ИИ', 3);

INSERT INTO participants_requirements (title, items_list, sort_order) VALUES 
('Документация', 'Выписка из ЕГРПО
Презентация деятельности
Устав (копия)', 1),
('Обязательства', 'Участие в рабочих группах
Соблюдение Кодекса этики ИИ
Ежегодный отчет', 2),
('Взносы', 'Вступительный взнос
Членский взнос (ежегодно)
Размер зависит от типа орг-ии', 3);

INSERT INTO participants_steps (step_num, title, description, sort_order) VALUES 
(1, 'Подача заявки', 'Заполните официальную форму на сайте, указав информацию о вашей организации и целях вступления.', 1),
(2, 'Квалификация', 'Экспертный совет рассматривает заявку и проводит собеседование для подтверждения соответствия критериям.', 2),
(3, 'Меморандум', 'Подписание меморандума о присоединении и получение официального сертификата участника Альянса.', 3);
