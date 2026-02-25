const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAllEvents() {
  try {
    console.log('Starting to delete all events...');
    
    // Delete all event dates first (due to foreign key constraints)
    const deletedDates = await prisma.eventDate.deleteMany({});
    console.log(`Deleted ${deletedDates.count} event dates`);
    
    // Delete all categories on events
    const deletedCategories = await prisma.categoriesOnEvents.deleteMany({});
    console.log(`Deleted ${deletedCategories.count} categories on events`);
    
    // Delete all custom fields
    const deletedCustomFields = await prisma.customField.deleteMany({});
    console.log(`Deleted ${deletedCustomFields.count} custom fields`);
    
    // Delete all events
    const deletedEvents = await prisma.event.deleteMany({});
    console.log(`Deleted ${deletedEvents.count} events`);
    
    console.log('All events and related data deleted successfully!');
  } catch (error) {
    console.error('Error deleting events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllEvents();
