
INSERT INTO department (name) 
VALUES
('Software Dev'),
('Marketing'),
('Security'),
('Sales');
INSERT INTO role (title, salary, department) VALUES
('Fullstack Dev', 100.00, 1),
('Marketing ', 100.00, 2),
('Security Gaurd', 100.00, 3),
('Sales Associate', 100.00, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Bob', 'Heart', 2, NULL),
('Jon', 'Plants', 3, NULL),
('Richard', 'Richards', 4, NULL),
('Chad', 'Old', 5, NULL);