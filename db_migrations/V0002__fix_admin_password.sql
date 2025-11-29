-- Обновляем пароль админа (admin123) с правильным bcrypt хешом
UPDATE users 
SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7tr2QMMS/i'
WHERE username = 'admin';