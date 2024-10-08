
INSERT INTO departments (department_name) 
VALUES
('Software Dev'),
('Marketing'),
('Security'),
('Sales');
INSERT INTO roles (title, salary, department_id) VALUES
('Fullstack Dev', 100.00, 1),
('Marketing ', 100.00, 2),
('Security Gaurd', 100.00, 3),
('Sales Associate', 100.00, 4);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Bob', 'Heart', 2, NULL),
('Jon', 'Plants', 3, NULL),
('Richard', 'Richards', 4, NULL),
('Chris', 'Old', 4, NULL);