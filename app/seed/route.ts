import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { area, apartment } from '../lib/building-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

async function seedArea() {
  console.log("Seeding Area...");
  await client.sql`
    CREATE TABLE IF NOT EXISTS areaBuilding (
      Area_id SERIAL PRIMARY KEY,
      Area VARCHAR(255) NOT NULL,
      Type VARCHAR(255) NOT NULL,
      Cluster VARCHAR(255)
    );
  `;

  const insertedArea = await Promise.all(
    area.map(
      (ar) => client.sql`
        INSERT INTO areaBuilding ( Area, Type, Cluster)
        VALUES ( ${ar.Area}, ${ar.Type}, ${ar.Cluster})
        ON CONFLICT (Area_id) DO NOTHING;
      `,
    ),
  );

  return insertedArea;
}

async function seedApartment() {

  await client.sql`
    CREATE TABLE IF NOT EXISTS apartment (
      Apartment_id SERIAL PRIMARY KEY,
      Block VARCHAR(255) NOT NULL,
      Floor VARCHAR(255),
      Flat VARCHAR(255),
      Intercom VARCHAR(255)
    );
  `;

  const insertedApartment = await Promise.all(
    apartment.map(
      (ap) => client.sql`
        INSERT INTO apartment ( Block, Floor, Flat, Intercom)
        VALUES ( ${ap.Block}, ${ap.Floor}, ${ap.Flat}, ${ap.Intercom})
        ON CONFLICT (Apartment_id) DO NOTHING;
      `,
    ),
  );

  return insertedApartment;
}

export async function GET() {

  try {
    await client.sql`BEGIN`;
    console.log('Seeding Database...');
    await seedArea();
    await seedApartment();
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    
    await client.sql`COMMIT`;
    console.log('Database seeded successfully');
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
