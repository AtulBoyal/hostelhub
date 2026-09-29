-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE machine_status AS ENUM ('available', 'running', 'finished', 'out_of_service');
CREATE TYPE purifier_status AS ENUM ('working', 'not_working');
CREATE TYPE issue_category AS ENUM ('electrical', 'plumbing', 'furniture', 'bathroom', 'fan_ac', 'wifi', 'other');
CREATE TYPE issue_status AS ENUM ('reported', 'in_progress', 'resolved', 'reopened');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'emergency');
CREATE TYPE post_type AS ENUM ('need', 'have');
CREATE TYPE post_status AS ENUM ('active', 'fulfilled');
CREATE TYPE item_type AS ENUM ('lost', 'found');
CREATE TYPE item_status AS ENUM ('active', 'claimed', 'returned');
CREATE TYPE announcement_priority AS ENUM ('normal', 'important', 'urgent');
CREATE TYPE community_category AS ENUM ('general', 'help', 'sports', 'study', 'social');

-- Table: hostels
CREATE TABLE hostels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: floors
CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- Corresponds to auth.users.id
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    hostel_id UUID REFERENCES hostels(id) ON DELETE SET NULL,
    floor_id UUID REFERENCES floors(id) ON DELETE SET NULL,
    room_number TEXT,
    avatar_url TEXT,
    contribution_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: washing_machines
CREATE TABLE washing_machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    machine_number TEXT NOT NULL,
    status machine_status DEFAULT 'available',
    started_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    expected_finish_time TIMESTAMP WITH TIME ZONE,
    instruction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: purifiers
CREATE TABLE purifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    status purifier_status DEFAULT 'working',
    taste_rating NUMERIC(3,2), -- e.g., 4.50
    water_rating NUMERIC(3,2),
    last_verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    last_verified_at TIMESTAMP WITH TIME ZONE,
    complaint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: maintenance_issues
CREATE TABLE maintenance_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reported_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    floor_id UUID REFERENCES floors(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category issue_category NOT NULL,
    photo_url TEXT,
    status issue_status DEFAULT 'reported',
    priority issue_priority DEFAULT 'low',
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: need_have_posts
CREATE TABLE need_have_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type post_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status post_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: lost_found_items
CREATE TABLE lost_found_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type item_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    photo_url TEXT,
    status item_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
    floor_id UUID REFERENCES floors(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority announcement_priority DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: community_posts
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category community_category DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: contributions
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_washing_machines_updated_at BEFORE UPDATE ON washing_machines FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_purifiers_updated_at BEFORE UPDATE ON purifiers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_maintenance_issues_updated_at BEFORE UPDATE ON maintenance_issues FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Indices for frequently queried fields
CREATE INDEX idx_profiles_hostel_id ON profiles(hostel_id);
CREATE INDEX idx_floors_hostel_id ON floors(hostel_id);
CREATE INDEX idx_washing_machines_floor_id ON washing_machines(floor_id);
CREATE INDEX idx_purifiers_floor_id ON purifiers(floor_id);
CREATE INDEX idx_maintenance_issues_reported_by ON maintenance_issues(reported_by);
CREATE INDEX idx_maintenance_issues_hostel_id ON maintenance_issues(hostel_id);
CREATE INDEX idx_maintenance_issues_floor_id ON maintenance_issues(floor_id);
CREATE INDEX idx_need_have_posts_user_id ON need_have_posts(user_id);
CREATE INDEX idx_lost_found_items_user_id ON lost_found_items(user_id);
CREATE INDEX idx_announcements_hostel_id ON announcements(hostel_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_contributions_user_id ON contributions(user_id);
