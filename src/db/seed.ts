import { database, pg } from './drizzle';
import { clients, services, contacts, clientsToServices } from './schema';

async function seed() {
  try {
    // Replace this with your specific user ID
    const USER_ID = 1; // Change this to your actual user ID

    // Insert sample clients
    const [client1, client2] = await Promise.all([
      database
        .insert(clients)
        .values({
          userId: USER_ID,
          business_name: 'Tech Solutions Ltd',
          primary_address: '123 Business Park, Tech Avenue',
          primary_email: 'contact@techsolutions.com',
          primary_phone: '+44 20 1234 5678',
          business_description:
            'IT consulting and software development company',
          sales_stage: 'qualified_opportunity',
          date_onboarded: new Date('2023-01-15'),
          annual_revenue_expected: '250000',
          additional_info: 'Interested in digital transformation services'
        })
        .returning(),
      database
        .insert(clients)
        .values({
          userId: USER_ID,
          business_name: 'Marketing Wizards',
          primary_address: '456 Creative Street',
          primary_email: 'hello@marketingwizards.com',
          primary_phone: '+44 20 8765 4321',
          business_description: 'Digital marketing agency',
          sales_stage: 'prospect',
          date_onboarded: new Date('2023-02-20'),
          annual_revenue_expected: '150000',
          additional_info: 'Looking for website redesign'
        })
        .returning()
    ]);

    // Insert sample services
    const [service1, service2] = await Promise.all([
      database
        .insert(services)
        .values({
          userId: USER_ID,
          name: 'Web Development Package',
          description:
            'Full-stack web development services including frontend and backend',
          included_services:
            'UI/UX Design, Frontend Development, Backend Development, Database Setup',
          delivery_process:
            '1. Requirements Gathering\n2. Design Phase\n3. Development\n4. Testing\n5. Deployment',
          pricing: 'Starting from £5000'
        })
        .returning(),
      database
        .insert(services)
        .values({
          userId: USER_ID,
          name: 'Digital Marketing Bundle',
          description: 'Comprehensive digital marketing services',
          included_services:
            'SEO, Content Marketing, Social Media Management, PPC Campaigns',
          delivery_process:
            '1. Strategy Planning\n2. Content Creation\n3. Campaign Setup\n4. Monitoring\n5. Reporting',
          pricing: '£1000/month'
        })
        .returning()
    ]);

    // Link clients to services
    await Promise.all([
      database.insert(clientsToServices).values({
        clientId: client1[0].id,
        serviceId: service1[0].id
      }),
      database.insert(clientsToServices).values({
        clientId: client2[0].id,
        serviceId: service2[0].id
      })
    ]);

    // Insert sample contacts
    await Promise.all([
      database.insert(contacts).values({
        clientId: client1[0].id,
        first_name: 'John',
        last_name: 'Smith',
        job_title: 'CTO',
        email: 'john.smith@techsolutions.com',
        phone: '+44 20 1234 5679',
        address: '123 Business Park, Tech Avenue',
        city: 'London',
        county: 'Greater London',
        postcode: 'EC1A 1BB',
        country: 'United Kingdom'
      }),
      database.insert(contacts).values({
        clientId: client2[0].id,
        first_name: 'Sarah',
        last_name: 'Johnson',
        job_title: 'Marketing Director',
        email: 'sarah.j@marketingwizards.com',
        phone: '+44 20 8765 4322',
        address: '456 Creative Street',
        city: 'Manchester',
        county: 'Greater Manchester',
        postcode: 'M1 1AE',
        country: 'United Kingdom'
      })
    ]);

    console.log('✅ Seed data inserted successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    if (pg) await pg.end();
  }
}

seed();
