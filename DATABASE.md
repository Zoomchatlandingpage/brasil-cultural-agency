# PostgreSQL Database Integration - Brasil Cultural Agency

## Database Overview

The application now uses PostgreSQL as the primary database, replacing the in-memory storage. All data is persisted and the system supports full CRUD operations across all entities.

## Database Schema

### Core Tables

#### admin_users
- **id**: Primary key (serial)
- **username**: Unique admin username
- **password**: Bcrypt hashed password
- **created_at**: Timestamp

#### users
- **id**: Primary key (serial)
- **username**: Unique username
- **email**: User email address
- **password**: Bcrypt hashed password
- **profile_type**: Detected traveler profile
- **quiz_responses**: JSON stored responses
- **conversation_log**: Chat history
- **created_at**: Timestamp

#### destinations
- **id**: Primary key (serial)
- **name**: Destination name
- **status**: active/inactive
- **description**: Full description
- **best_months**: Optimal travel periods
- **ideal_profiles**: Target traveler types
- **price_range_min/max**: Budget ranges
- **airport_codes**: Flight search codes
- **hotel_search_terms**: Accommodation keywords
- **selling_points**: Key attractions
- **main_image_url**: Featured image
- **created_at**: Timestamp

#### leads
- **id**: Primary key (serial)
- **user_id**: Foreign key to users
- **status**: Lead status
- **profile_score**: AI confidence score
- **interest_level**: Engagement level
- **recommended_destinations**: AI suggestions
- **estimated_budget**: Budget analysis
- **travel_dates**: Planned dates
- **booking_status**: Conversion status
- **created_at**: Timestamp

#### travel_packages
- **id**: Primary key (serial)
- **name**: Package name
- **destination_id**: Foreign key to destinations
- **status**: active/inactive
- **duration_days**: Trip length
- **base_price**: Starting price
- **included_services**: What's included
- **excluded_services**: What's not included
- **target_profiles**: Ideal travelers
- **seasonal_pricing**: Price variations
- **markup_percentage**: Profit margin
- **created_at**: Timestamp

#### bookings
- **id**: Primary key (serial)
- **user_id**: Foreign key to users
- **package_id**: Foreign key to travel_packages
- **booking_status**: Status tracking
- **flight_booking_ref**: External reference
- **hotel_booking_ref**: External reference
- **total_price**: Final amount
- **travel_date_start**: Trip start
- **travel_date_end**: Trip end
- **passengers_count**: Number of travelers
- **special_requests**: Custom requirements
- **api_responses**: External API data
- **created_at**: Timestamp

#### ai_knowledge
- **id**: Primary key (serial)
- **category**: Knowledge category
- **topic**: Specific topic
- **context**: Background information
- **response_template**: AI response template
- **keywords**: Search keywords
- **data_sources**: Information sources
- **priority**: Importance level
- **usage_count**: Usage statistics
- **effectiveness_score**: Performance metric
- **created_at**: Timestamp

#### api_configs
- **id**: Primary key (serial)
- **provider_name**: API provider
- **api_type**: Service type (flight/hotel)
- **status**: active/inactive
- **endpoint_url**: API endpoint
- **api_key_field**: Environment variable name
- **markup_percentage**: Commission rate
- **success_rate**: Reliability metric
- **rate_limit**: Request limits
- **cost_per_call**: API costs
- **commission_rate**: Revenue sharing
- **last_used**: Last activity
- **created_at**: Timestamp

#### travel_operators
- **id**: Primary key (serial)
- **company_name**: Operator name
- **status**: Partnership status
- **operator_type**: Business type
- **api_provider**: Technical provider
- **coverage_areas**: Service regions
- **specialties**: Expertise areas
- **commission_structure**: Payment terms
- **booking_terms**: Conditions
- **contact_info**: Contact details
- **partnership_level**: Relationship tier
- **created_at**: Timestamp

## Initial Data Seeded

### Admin User
- Username: `admin`
- Password: `admin123`

### Destinations
1. **Rio de Janeiro**: Iconic beaches, Christ the Redeemer, vibrant nightlife
2. **Salvador**: Afro-Brazilian culture, historic Pelourinho district
3. **Chapada Diamantina**: Natural paradise with waterfalls and caves

### AI Knowledge Base
- Brazilian cultural overview
- Rio de Janeiro attractions guide

### API Configurations
- Amadeus flight booking integration
- Booking.com hotel reservations

## Database Commands

### Push Schema Changes
```bash
npm run db:push
```

### View Database in Studio
```bash
npm run db:studio
```

### Generate Migrations
```bash
npm run db:migrate
```

## Environment Variables

Required PostgreSQL environment variables (automatically configured):
- `DATABASE_URL`: Complete connection string
- `PGHOST`: Database host
- `PGUSER`: Database user
- `PGPASSWORD`: Database password
- `PGDATABASE`: Database name
- `PGPORT`: Database port

## Connection Details

The application uses Neon PostgreSQL with:
- **ORM**: Drizzle ORM with neon-serverless driver
- **Connection Pool**: Managed connection pooling
- **Relations**: Properly defined foreign key relationships
- **Type Safety**: Full TypeScript integration

## Performance Features

- Connection pooling for optimal performance
- Indexed primary and foreign keys
- Efficient query patterns with Drizzle
- Proper transaction handling
- Error recovery and retry logic

## Migration Strategy

From in-memory to PostgreSQL:
1. Schema pushed to database ✓
2. Initial data seeded ✓
3. DatabaseStorage implementation active ✓
4. All API endpoints using PostgreSQL ✓
5. Admin authentication working ✓

## Data Persistence

All application data is now permanently stored:
- User accounts and authentication
- Travel destinations and packages
- AI chat conversations and leads
- Booking records and transactions
- System configuration and knowledge base

The database provides full data integrity, ACID compliance, and production-ready persistence for the Brasil Cultural Agency platform.