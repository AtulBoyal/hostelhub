-- Seed Data for HostelHub

-- Hostels
INSERT INTO hostels (id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'Ramanujan');

-- Floors (1 to 10)
INSERT INTO floors (id, hostel_id, floor_number) VALUES 
('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 1),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 2),
('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 3),
('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 4),
('22222222-2222-2222-2222-222222222225', '11111111-1111-1111-1111-111111111111', 5),
('22222222-2222-2222-2222-222222222226', '11111111-1111-1111-1111-111111111111', 6),
('22222222-2222-2222-2222-222222222227', '11111111-1111-1111-1111-111111111111', 7),
('22222222-2222-2222-2222-222222222228', '11111111-1111-1111-1111-111111111111', 8),
('22222222-2222-2222-2222-222222222229', '11111111-1111-1111-1111-111111111111', 9),
('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111111', 10);

-- Profiles
INSERT INTO profiles (id, name, email, hostel_id, floor_id, room_number, contribution_points) VALUES 
('33333333-3333-3333-3333-333333333331', 'Rahul Sharma', 'rahul.s@example.com', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '104', 150),
('33333333-3333-3333-3333-333333333332', 'Ankit Verma', 'ankit.v@example.com', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '312', 45),
('33333333-3333-3333-3333-333333333333', 'Priya Kumar', 'priya.k@example.com', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '205', 80);

-- Washing Machines
INSERT INTO washing_machines (floor_id, machine_number, status, started_by, start_time, expected_finish_time) VALUES 
('22222222-2222-2222-2222-222222222221', 'M-101', 'available', NULL, NULL, NULL),
('22222222-2222-2222-2222-222222222221', 'M-102', 'running', '33333333-3333-3333-3333-333333333331', NOW() - INTERVAL '20 minutes', NOW() + INTERVAL '25 minutes'),
('22222222-2222-2222-2222-222222222222', 'M-201', 'available', NULL, NULL, NULL),
('22222222-2222-2222-2222-222222222222', 'M-202', 'out_of_service', NULL, NULL, NULL),
('22222222-2222-2222-2222-222222222223', 'M-301', 'running', '33333333-3333-3333-3333-333333333332', NOW() - INTERVAL '5 minutes', NOW() + INTERVAL '40 minutes'),
('22222222-2222-2222-2222-222222222223', 'M-302', 'available', NULL, NULL, NULL),
('22222222-2222-2222-2222-222222222224', 'M-401', 'available', NULL, NULL, NULL),
('22222222-2222-2222-2222-222222222224', 'M-402', 'finished', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '50 minutes', NOW() - INTERVAL '5 minutes'),
('22222222-2222-2222-2222-222222222225', 'M-501', 'available', NULL, NULL, NULL),
('22222222-2222-2222-2222-222222222226', 'M-601', 'available', NULL, NULL, NULL);

-- Purifiers
INSERT INTO purifiers (floor_id, status, taste_rating, water_rating, last_verified_by, last_verified_at) VALUES 
('22222222-2222-2222-2222-222222222221', 'working', 4.5, 4.2, '33333333-3333-3333-3333-333333333331', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'working', 4.0, 4.0, '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '3 days'),
('22222222-2222-2222-2222-222222222223', 'not_working', NULL, NULL, NULL, NULL),
('22222222-2222-2222-2222-222222222224', 'working', 4.8, 4.5, NULL, NULL),
('22222222-2222-2222-2222-222222222225', 'working', 4.1, 4.3, NULL, NULL),
('22222222-2222-2222-2222-222222222226', 'working', 4.7, 4.6, NULL, NULL);

-- Maintenance Issues
INSERT INTO maintenance_issues (reported_by, hostel_id, floor_id, title, description, category, status, priority, created_at) VALUES 
('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', 'Bathroom tap leakage', 'The tap in the 3rd floor washroom is continuously leaking and wasting water.', 'plumbing', 'in_progress', 'medium', NOW() - INTERVAL '2 days'),
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Corridor light not working', 'The light near room 104 is completely fused.', 'electrical', 'reported', 'low', NOW() - INTERVAL '1 day'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Fan making noise', 'Ceiling fan in room 205 makes a loud creaking noise.', 'fan_ac', 'reported', 'low', NOW() - INTERVAL '5 hours'),
('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', 'Wi-Fi slow on Floor 3', 'Getting terrible speeds on Floor 3 for the past 24 hours.', 'wifi', 'reported', 'high', NOW() - INTERVAL '12 hours'),
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', NULL, 'Common-area switch broken', 'Switchboard in the ground floor common room is completely broken and dangerous.', 'electrical', 'resolved', 'high', NOW() - INTERVAL '5 days');

-- I Need / I Have
INSERT INTO need_have_posts (user_id, type, title, description, category, status) VALUES 
('33333333-3333-3333-3333-333333333331', 'need', 'Scientific Calculator', 'Need a scientific calculator for my mid-sem exam tomorrow. Will return by evening.', 'Academics', 'active'),
('33333333-3333-3333-3333-333333333332', 'need', 'LAN Cable', 'My LAN cable broke. Does anyone have a spare one I can keep?', 'Electronics', 'active'),
('33333333-3333-3333-3333-333333333333', 'have', 'Engineering Drawing Kit', 'I have a complete ED kit that I no longer need. Happy to lend it to any first-year.', 'Academics', 'active');

-- Lost & Found
INSERT INTO lost_found_items (user_id, type, title, description, location, status) VALUES 
('33333333-3333-3333-3333-333333333332', 'lost', 'Boat Earbuds Case', 'Lost my black boat earbuds case (without the earbuds).', 'Library or near Mess', 'active'),
('33333333-3333-3333-3333-333333333331', 'found', 'Black Umbrella', 'Found a black umbrella left on the table during dinner time.', 'Mess Hall', 'active');

-- Announcements
INSERT INTO announcements (created_by, hostel_id, floor_id, title, content, priority) VALUES 
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', NULL, 'Pest control scheduled for tomorrow', 'Please ensure all your food items are kept inside cupboards. Pest control will happen between 10 AM and 2 PM.', 'important'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NULL, 'Mess menu updated for next week', 'The mess menu has been updated. Please check the notice board or the mess section for details.', 'normal'),
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', NULL, 'Night canteen timing extended', 'During the mid-sem week, the night canteen will remain open until 4 AM.', 'normal');

-- Community Posts
INSERT INTO community_posts (user_id, title, content, category) VALUES 
('33333333-3333-3333-3333-333333333333', 'Anyone up for a quick table tennis match?', 'In the common room right now. Come join!', 'sports'),
('33333333-3333-3333-3333-333333333332', 'CS202 Study Session', 'Organizing a study session for CS202 tonight at 9 PM in the reading room. Join if interested!', 'study');

-- Notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES 
('33333333-3333-3333-3333-333333333332', 'Maintenance Request Updated', 'Your issue "Bathroom tap leakage" status changed to In Progress.', 'maintenance', false),
('33333333-3333-3333-3333-333333333332', 'Laundry Machine Available', 'Machine M-302 on your floor is now available.', 'laundry', false),
('33333333-3333-3333-3333-333333333331', 'New Announcement', 'Pest control scheduled for tomorrow. Please read the notice.', 'announcement', true);

-- Contributions
INSERT INTO contributions (user_id, type, description, points) VALUES 
('33333333-3333-3333-3333-333333333331', 'Issue Reported', 'Reported a fused corridor light', 10),
('33333333-3333-3333-3333-333333333331', 'Item Found', 'Returned a found umbrella', 50),
('33333333-3333-3333-3333-333333333333', 'Item Offered', 'Offered Engineering Drawing Kit', 30);
