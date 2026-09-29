-- Add laundry to issue_category enum
ALTER TYPE issue_category ADD VALUE IF NOT EXISTS 'laundry';

-- Clear existing washing machines
DELETE FROM washing_machines;

-- Insert exactly one washing machine per floor for Ramanujan
INSERT INTO washing_machines (floor_id, machine_number, status)
SELECT 
    f.id,
    'Washing Machine 1',
    'available'
FROM floors f
JOIN hostels h ON f.hostel_id = h.id
WHERE h.name = 'Ramanujan'
ORDER BY f.floor_number;
