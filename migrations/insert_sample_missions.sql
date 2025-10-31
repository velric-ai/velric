-- Insert sample missions into mission_templates table
-- These missions are based on real company projects and provide realistic learning experiences

INSERT INTO mission_templates (
    title, 
    description, 
    skills, 
    industries, 
    difficulty, 
    time_estimate, 
    category, 
    tags, 
    time_limit,
    details
) VALUES 
    (
        'Netflix Recommendation Engine',
        'Build a personalized content recommendation system similar to Netflix''s algorithm. You''ll implement collaborative filtering and content-based filtering to suggest movies and shows based on user preferences and viewing history.',
        ARRAY['Python', 'Machine Learning', 'TensorFlow', 'FastAPI', 'Data Analysis'],
        ARRAY['Media', 'Technology'],
        'Advanced',
        '6-8 hours',
        'AI/ML',
        ARRAY['recommendation-systems', 'machine-learning', 'python', 'tensorflow', 'api'],
        '10 days',
        '{
            "overview": "Create a sophisticated recommendation engine that analyzes user behavior and content metadata to provide personalized suggestions",
            "requirements": [
                "Implement collaborative filtering algorithm",
                "Build content-based filtering system", 
                "Create REST API endpoints",
                "Handle real-time recommendations",
                "Implement basic fraud detection"
            ],
            "technologies": ["Python", "TensorFlow", "FastAPI", "Redis", "PostgreSQL"],
            "learningOutcomes": [
                "Understanding of ML recommendation algorithms",
                "Experience with real-time data processing", 
                "API design and development",
                "Working with large datasets"
            ],
            "deliverables": [
                "Working recommendation API",
                "Documentation of algorithm approach",
                "Performance metrics and analysis",
                "Demo with sample data"
            ]
        }'
    ),
    (
        'Stripe Payment Gateway',
        'Develop a secure payment processing system with fraud detection, similar to Stripe''s core functionality. Handle multiple payment methods, currencies, and implement robust security measures.',
        ARRAY['Node.js', 'Express', 'PostgreSQL', 'Security', 'API Design'],
        ARRAY['Finance', 'Technology'],
        'Advanced', 
        '5-7 hours',
        'Backend Development',
        ARRAY['payments', 'security', 'nodejs', 'api', 'fintech'],
        '8 days',
        '{
            "overview": "Build a comprehensive payment processing system with security, fraud detection, and multi-currency support",
            "requirements": [
                "Secure payment processing endpoints",
                "Multi-currency support",
                "Fraud detection algorithms",
                "Webhook system for notifications",
                "Comprehensive error handling"
            ],
            "technologies": ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
            "learningOutcomes": [
                "Payment processing best practices",
                "Security implementation",
                "Fraud detection techniques", 
                "Financial API design"
            ],
            "deliverables": [
                "Payment processing API",
                "Security documentation", 
                "Fraud detection system",
                "Integration examples"
            ]
        }'
    ),
    (
        'Airbnb Property Platform',
        'Create a property listing and booking platform like Airbnb. Build features for hosts to list properties, guests to search and book, and handle the complete booking workflow.',
        ARRAY['React', 'Node.js', 'MongoDB', 'Express', 'Google Maps API'],
        ARRAY['E-commerce', 'Technology'],
        'Intermediate',
        '4-6 hours', 
        'Full-Stack Development',
        ARRAY['react', 'nodejs', 'booking', 'platform', 'maps'],
        '7 days',
        '{
            "overview": "Develop a complete property rental platform with search, booking, and host management capabilities",
            "requirements": [
                "Property listing management",
                "Advanced search and filtering",
                "Booking system with availability",
                "Google Maps integration",
                "User authentication and profiles"
            ],
            "technologies": ["React", "Node.js", "MongoDB", "Express", "Google Maps API"],
            "learningOutcomes": [
                "Full-stack application development",
                "Database design and relationships",
                "Third-party API integration",
                "Complex user workflows"
            ],
            "deliverables": [
                "Complete web application",
                "Property management dashboard",
                "Booking system", 
                "Mobile-responsive design"
            ]
        }'
    ),
    (
        'Spotify Analytics Dashboard',
        'Build a real-time music streaming analytics dashboard similar to Spotify''s internal tools. Visualize streaming data, user engagement metrics, and provide actionable insights.',
        ARRAY['React', 'D3.js', 'WebSocket', 'Data Visualization', 'Node.js'],
        ARRAY['Media', 'Technology'],
        'Intermediate',
        '3-5 hours',
        'Frontend Development',
        ARRAY['dashboard', 'analytics', 'react', 'd3js', 'realtime'],
        '5 days',
        '{
            "overview": "Create an interactive analytics dashboard that processes and visualizes streaming data in real-time",
            "requirements": [
                "Real-time data visualization",
                "Interactive charts and graphs", 
                "Performance metrics display",
                "Responsive design",
                "Export and sharing capabilities"
            ],
            "technologies": ["React", "D3.js", "WebSocket", "Node.js", "InfluxDB"],
            "learningOutcomes": [
                "Data visualization techniques",
                "Real-time data handling",
                "Performance optimization",
                "Dashboard UX design"
            ],
            "deliverables": [
                "Interactive dashboard",
                "Real-time data streaming",
                "Export functionality",
                "Performance documentation"
            ]
        }'
    ),
    (
        'Uber Location Tracking System',
        'Develop a real-time location tracking and route optimization system like Uber''s core technology. Handle GPS data, optimize routes, and manage driver-rider matching.',
        ARRAY['Go', 'Redis', 'WebSocket', 'PostgreSQL', 'Geospatial'],
        ARRAY['Technology', 'Transportation'],
        'Advanced',
        '5-6 hours',
        'Backend Development',
        ARRAY['geolocation', 'realtime', 'golang', 'optimization', 'websocket'],
        '9 days',
        '{
            "overview": "Build a sophisticated location tracking system with real-time updates and route optimization",
            "requirements": [
                "Real-time GPS tracking",
                "Route optimization algorithms",
                "Driver-rider matching system",
                "Geofencing capabilities",
                "Performance at scale"
            ],
            "technologies": ["Go", "Redis", "WebSocket", "PostgreSQL", "Docker"],
            "learningOutcomes": [
                "Geospatial data processing",
                "Real-time system architecture", 
                "Performance optimization",
                "Distributed system design"
            ],
            "deliverables": [
                "Location tracking API",
                "Route optimization engine",
                "Real-time communication system",
                "Performance benchmarks"
            ]
        }'
    ),
    (
        'Tesla Battery Management System',
        'Create an IoT-based battery monitoring and management system similar to Tesla''s technology. Monitor battery health, predict maintenance needs, and optimize charging cycles.',
        ARRAY['Python', 'IoT', 'Time Series', 'Machine Learning', 'FastAPI'],
        ARRAY['Automotive', 'Technology'], 
        'Advanced',
        '7-9 hours',
        'IoT/Hardware',
        ARRAY['iot', 'battery', 'monitoring', 'ml', 'automotive'],
        '12 days',
        '{
            "overview": "Develop an intelligent battery management system with predictive maintenance and optimization capabilities",
            "requirements": [
                "IoT sensor data collection",
                "Battery health monitoring",
                "Predictive maintenance algorithms",
                "Charging optimization",
                "Alert and notification system"
            ],
            "technologies": ["Python", "InfluxDB", "TensorFlow", "FastAPI", "MQTT"],
            "learningOutcomes": [
                "IoT system architecture",
                "Time series data analysis",
                "Predictive modeling",
                "Hardware-software integration"
            ],
            "deliverables": [
                "Battery monitoring dashboard",
                "Predictive maintenance model",
                "IoT data pipeline",
                "Alert system"
            ]
        }'
    ),
    (
        'Discord Chat Application',
        'Build a real-time chat application with features similar to Discord. Implement channels, voice chat capabilities, user management, and message persistence.',
        ARRAY['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'WebRTC'],
        ARRAY['Technology', 'Gaming'],
        'Intermediate',
        '4-6 hours',
        'Full-Stack Development', 
        ARRAY['chat', 'realtime', 'react', 'websocket', 'voice'],
        '6 days',
        '{
            "overview": "Create a feature-rich real-time communication platform with text and voice capabilities",
            "requirements": [
                "Real-time text messaging",
                "Channel and server management",
                "Voice chat integration",
                "User authentication",
                "Message history and search"
            ],
            "technologies": ["React", "Node.js", "Socket.io", "PostgreSQL", "WebRTC"],
            "learningOutcomes": [
                "Real-time communication protocols",
                "WebRTC implementation",
                "Socket programming",
                "Chat application architecture"
            ],
            "deliverables": [
                "Chat application",
                "Voice communication system",
                "User management system",
                "Mobile-responsive interface"
            ]
        }'
    ),
    (
        'Amazon Inventory Management',
        'Develop an intelligent inventory management system like Amazon''s warehouses. Implement automated stock tracking, demand forecasting, and supply chain optimization.',
        ARRAY['Java', 'Spring Boot', 'MySQL', 'Machine Learning', 'REST API'],
        ARRAY['E-commerce', 'Retail'],
        'Intermediate',
        '5-7 hours',
        'Backend Development',
        ARRAY['inventory', 'supply-chain', 'java', 'ml', 'optimization'],
        '8 days',
        '{
            "overview": "Build a comprehensive inventory management system with predictive analytics and automation",
            "requirements": [
                "Automated stock tracking",
                "Demand forecasting model",
                "Supply chain optimization",
                "Reorder point calculations",
                "Reporting and analytics"
            ],
            "technologies": ["Java", "Spring Boot", "MySQL", "Python", "Apache Kafka"],
            "learningOutcomes": [
                "Enterprise application development",
                "Supply chain management concepts",
                "Predictive analytics",
                "System integration patterns"
            ],
            "deliverables": [
                "Inventory management API",
                "Forecasting model",
                "Admin dashboard",
                "Performance reports"
            ]
        }'
    );

-- Add sample user missions to show progress states
-- This assumes there are users in the system
-- You can uncomment this after users are created:

/*
INSERT INTO user_missions (user_id, mission_id, status) 
SELECT 
    u.id as user_id,
    mt.id as mission_id,
    CASE 
        WHEN random() < 0.3 THEN 'completed'
        WHEN random() < 0.5 THEN 'in_progress' 
        WHEN random() < 0.7 THEN 'starred'
        ELSE 'suggested'
    END as status
FROM users u
CROSS JOIN mission_templates mt
WHERE random() < 0.4; -- Only assign 40% of missions to each user
*/