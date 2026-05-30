-- Insert missing Arabic translations for quality-packaging
-- Run this in Supabase SQL Editor to populate missing rows

-- Inspection section title
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_inspection_title', 'quality-packaging', 'Inspection', 'title', 'عملية فحص الجودة', 'ar', 150)
ON CONFLICT(id) DO NOTHING;

-- Inspection item2
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_inspection_item2_title', 'quality-packaging', 'Inspection', 'item2_title', 'موافقة العينة', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_inspection_item2_desc', 'quality-packaging', 'Inspection', 'item2_desc', 'فحص شامل للعينات مقابل مواصفاتك قبل تفويض الإنتاج', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

-- Inspection item4 (item4_desc already exists, just ensuring)
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_inspection_item4_title', 'quality-packaging', 'Inspection', 'item4_title', 'التوثيق', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

-- Standards section item6
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_standards_item6', 'quality-packaging', 'Standards', 'item6', 'فحص توافق التوثيق', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

-- Standards note_desc
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_standards_note_desc', 'quality-packaging', 'Standards', 'note_desc', 'متاحة بناءً على الطلب لضمان إضافي', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

-- Solutions section
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_title', 'quality-packaging', 'Solutions', 'title', 'حلول التغليف', 'ar', 150)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_desc', 'quality-packaging', 'Solutions', 'desc', 'تغليف احترافي مصمم للنقل الآمن والتقديم الجاهز للسوق', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_item1_title', 'quality-packaging', 'Solutions', 'item1_title', 'تغليف التصدير', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_item1_desc', 'quality-packaging', 'Solutions', 'item1_desc', 'تغليف قوي مصمم للشحن الدولي، بما في ذلك التغليف على منصات نقالة والحاويات', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_item2_title', 'quality-packaging', 'Solutions', 'item2_title', 'تغليف البيع بالتجزئة', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_item2_desc', 'quality-packaging', 'Solutions', 'item2_desc', 'تغليف جاهز للمستهلك مع العلامات التجارية المخصصة والملصقات والمواد التقديمية', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_item3_desc', 'quality-packaging', 'Solutions', 'item3_desc', 'حلول تغليف بدون علامة مخصصة مع هويتك وتواصفاتك', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_item4_title', 'quality-packaging', 'Solutions', 'item4_title', 'التغليف الواقي', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_solutions_item4_desc', 'quality-packaging', 'Solutions', 'item4_desc', 'تغليف متخصص للمنتجات الهشة أو الخطرة أو الحساسة للحرارة', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

-- Options section desc and type tags
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_desc', 'quality-packaging', 'Options', 'desc', 'من التغليف الصناعي بالجملة إلى التقديم الجاهز للبيع، نوفر حلولاً لكل احتياج', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_type1_tag1', 'quality-packaging', 'Options', 'type1_tag1', 'صناديق مموجة', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_type1_tag4', 'quality-packaging', 'Options', 'type1_tag4', 'غلاف شفاف', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_type1_tag5', 'quality-packaging', 'Options', 'type1_tag5', 'براميل صناعية', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_type2_title', 'quality-packaging', 'Options', 'type2_title', 'تغليف المستهلك', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_type2_tag2', 'quality-packaging', 'Options', 'type2_tag2', 'علب Blister', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_type3_tag1', 'quality-packaging', 'Options', 'type3_tag1', 'تغليف بالفراغ', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_type3_tag3', 'quality-packaging', 'Options', 'type3_tag3', 'يتحكم فيه درجة الحرارة', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_options_type3_tag4', 'quality-packaging', 'Options', 'type3_tag4', 'مضاد للكهرباء الساكنة', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

-- Sustainable section
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_sustainable_desc', 'quality-packaging', 'Sustainable', 'desc', 'خيارات تغليف مسؤولة بيئياً دون المساس بالحماية أو الجودة', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_sustainable_item1_title', 'quality-packaging', 'Sustainable', 'item1_title', 'تغليف صديق للبيئة', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_sustainable_item2_title', 'quality-packaging', 'Sustainable', 'item2_title', 'المواد القابلة لإعادة التدوير', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_sustainable_item2_desc', 'quality-packaging', 'Sustainable', 'item2_desc', 'حلول تغليف باستخدام مواد قابلة لإعادة التدوير متوافقة مع معايير البيئة العالمية', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_sustainable_feat1', 'quality-packaging', 'Sustainable', 'feat1', 'خيارات قابلة للتحلل الحيوي', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_sustainable_feat2', 'quality-packaging', 'Sustainable', 'feat2', 'مواد معتمدة من FSC', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_sustainable_feat3', 'quality-packaging', 'Sustainable', 'feat3', 'شحن محايد للكربون', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

-- Compliance section
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_compliance_title', 'quality-packaging', 'Compliance', 'title', 'الامتثال والشهادات', 'ar', 120)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_compliance_desc', 'quality-packaging', 'Compliance', 'desc', 'تتوافق جميع حلول الجودة والتغليف لدينا مع المعايير الدولية واللوائح الخاصة بكل دولة', 'ar', 240)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_compliance_cert1', 'quality-packaging', 'Compliance', 'cert1', 'معتمد من ISO', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_compliance_cert2', 'quality-packaging', 'Compliance', 'cert2', 'متوافق مع FDA', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_compliance_cert3', 'quality-packaging', 'Compliance', 'cert3', 'معتمد من FSSAI', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_compliance_cert4', 'quality-packaging', 'Compliance', 'cert4', 'علامة CE', 'ar', 80)
ON CONFLICT(id) DO NOTHING;

-- CTA section
INSERT INTO site_content (id, page_name, section_name, content_key, content_value, language_code, char_limit)
VALUES ('ar_quality-packaging_cta_btn_text', 'quality-packaging', 'CTA', 'btn_text', 'اتصل بنا', 'ar', 80)
ON CONFLICT(id) DO NOTHING;
