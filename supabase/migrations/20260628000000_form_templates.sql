CREATE TABLE form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '📋',
  category TEXT DEFAULT 'general',
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_primitive BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read templates" ON form_templates
  FOR SELECT USING (is_primitive OR owner_id = auth.uid());

CREATE POLICY "insert own" ON form_templates
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "update own" ON form_templates
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "delete own" ON form_templates
  FOR DELETE USING (owner_id = auth.uid());

INSERT INTO form_templates (name, description, icon, category, questions, is_primitive) VALUES
('Customer Feedback', '5 questions · product satisfaction', '📋', 'feedback', '[
  {"type": "short_text", "label": "What is your name?", "required": false},
  {"type": "multiple_choice", "label": "How did you hear about us?", "required": true, "options": ["Social media", "Friend", "Search engine", "Advertisement", "Other"]},
  {"type": "rating", "label": "How satisfied are you with our product? (1-5)", "required": true, "max_rating": 5},
  {"type": "long_text", "label": "What do you like most?", "required": false},
  {"type": "long_text", "label": "What could we improve?", "required": false}
]'::jsonb, true),
('Event Registration', '4 questions · sign-up form', '🎫', 'events', '[
  {"type": "short_text", "label": "Full name", "required": true},
  {"type": "short_text", "label": "Email address", "required": true},
  {"type": "multiple_choice", "label": "Which session will you attend?", "required": true, "options": ["Morning", "Afternoon", "Full day"]},
  {"type": "multiple_choice", "label": "Dietary requirements", "required": false, "options": ["None", "Vegetarian", "Vegan", "Halal", "Other"]}
]'::jsonb, true),
('Job Application', '5 questions · candidate screening', '💼', 'hr', '[
  {"type": "short_text", "label": "Full name", "required": true},
  {"type": "short_text", "label": "Email address", "required": true},
  {"type": "file_upload", "label": "Upload your resume", "required": true, "max_files": 1, "accepted_types": ["application/pdf"]},
  {"type": "long_text", "label": "Why do you want to work here?", "required": true},
  {"type": "multiple_choice", "label": "How did you find this position?", "required": false, "options": ["LinkedIn", "Company website", "Referral", "Job board", "Other"]}
]'::jsonb, true),
('Quiz', '4 questions · knowledge test', '📝', 'education', '[
  {"type": "short_text", "label": "Your name", "required": true},
  {"type": "multiple_choice", "label": "What is the capital of France?", "required": true, "options": ["London", "Paris", "Berlin", "Madrid"]},
  {"type": "multiple_choice", "label": "Which planet is known as the Red Planet?", "required": true, "options": ["Venus", "Jupiter", "Mars", "Saturn"]},
  {"type": "rating", "label": "How difficult was this quiz? (1-5)", "required": false, "max_rating": 5}
]'::jsonb, true),
('Contact Information', '4 questions · get in touch', '📇', 'general', '[
  {"type": "short_text", "label": "Full name", "required": true},
  {"type": "short_text", "label": "Email address", "required": true},
  {"type": "short_text", "label": "Phone number", "required": false},
  {"type": "long_text", "label": "Your message", "required": true}
]'::jsonb, true),
('NPS Survey', '2 questions · net promoter score', '📊', 'feedback', '[
  {"type": "rating", "label": "How likely are you to recommend us? (1-10)", "required": true, "max_rating": 10},
  {"type": "long_text", "label": "What is the main reason for your score?", "required": false}
]'::jsonb, true);
