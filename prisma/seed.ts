import bcrypt from 'bcryptjs';
import { PrismaClient, CardType, OwnershipType, CategoryGroup, PaymentMethod, ReportFormat, ReportType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pinHash = await bcrypt.hash('1111', 12);

  const [parget, rajan] = await Promise.all([
    prisma.user.upsert({
      where: { name: 'Parget' },
      update: { pinHash, role: UserRole.PARTNER },
      create: { name: 'Parget', pinHash, role: UserRole.PARTNER }
    }),
    prisma.user.upsert({
      where: { name: 'Rajan' },
      update: { pinHash, role: UserRole.PARTNER },
      create: { name: 'Rajan', pinHash, role: UserRole.PARTNER }
    })
  ]);

  const categories = await Promise.all(
    [
      { name: 'Materials', slug: 'materials', group: CategoryGroup.renovation },
      { name: 'Tools', slug: 'tools', group: CategoryGroup.tools },
      { name: 'Fuel', slug: 'fuel', group: CategoryGroup.vehicle },
      { name: 'Vehicle', slug: 'vehicle', group: CategoryGroup.vehicle },
      { name: 'Meals', slug: 'meals', group: CategoryGroup.operations },
      { name: 'Office', slug: 'office', group: CategoryGroup.operations },
      { name: 'Software', slug: 'software', group: CategoryGroup.technology },
      { name: 'Marketing', slug: 'marketing', group: CategoryGroup.marketing },
      { name: 'Miscellaneous', slug: 'miscellaneous', group: CategoryGroup.other }
    ].map((category, index) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: { group: category.group, sortOrder: index },
        create: { ...category, sortOrder: index }
      })
    )
  );

  const materialCategory = categories.find((category) => category.name === 'Materials');
  const fuelCategory = categories.find((category) => category.name === 'Fuel');
  const mealsCategory = categories.find((category) => category.name === 'Meals');
  const softwareCategory = categories.find((category) => category.name === 'Software');

  await Promise.all([
    prisma.card.upsert({
      where: { id: 'card-parget-business-visa' },
      update: {},
      create: {
        id: 'card-parget-business-visa',
        cardName: 'Business Visa',
        bank: 'TD',
        type: CardType.credit,
        ownership: OwnershipType.business,
        ownerId: parget.id,
        last4: '1234',
        color: '#d79a12'
      }
    }),
    prisma.card.upsert({
      where: { id: 'card-parget-business-mastercard' },
      update: {},
      create: {
        id: 'card-parget-business-mastercard',
        cardName: 'Business Mastercard',
        bank: 'RBC',
        type: CardType.credit,
        ownership: OwnershipType.business,
        ownerId: parget.id,
        last4: '2345',
        color: '#12100d'
      }
    }),
    prisma.card.upsert({
      where: { id: 'card-rajan-business-visa' },
      update: {},
      create: {
        id: 'card-rajan-business-visa',
        cardName: 'Business Visa',
        bank: 'BMO',
        type: CardType.credit,
        ownership: OwnershipType.business,
        ownerId: rajan.id,
        last4: '3456',
        color: '#b77c0e'
      }
    }),
    prisma.card.upsert({
      where: { id: 'card-rajan-personal-debit' },
      update: {},
      create: {
        id: 'card-rajan-personal-debit',
        cardName: 'Personal Debit',
        bank: 'CIBC',
        type: CardType.debit,
        ownership: OwnershipType.personal,
        ownerId: rajan.id,
        last4: '4567',
        color: '#38322a'
      }
    })
  ]);

  await Promise.all([
    prisma.expenseRule.upsert({
      where: { id: 'rule-home-depot' },
      update: {},
      create: {
        id: 'rule-home-depot',
        name: 'Home Depot Materials',
        vendorPattern: 'home depot',
        categoryId: materialCategory?.id,
        condition: { vendor: 'Home Depot' }
      }
    }),
    prisma.expenseRule.upsert({
      where: { id: 'rule-esso-fuel' },
      update: {},
      create: {
        id: 'rule-esso-fuel',
        name: 'Fuel rule',
        vendorPattern: 'esso',
        categoryId: fuelCategory?.id,
        condition: { category: 'Fuel' }
      }
    }),
    prisma.expenseRule.upsert({
      where: { id: 'rule-coffee-meals' },
      update: {},
      create: {
        id: 'rule-coffee-meals',
        name: 'Meals rule',
        vendorPattern: 'coffee',
        categoryId: mealsCategory?.id,
        condition: { category: 'Meals' }
      }
    }),
    prisma.expenseRule.upsert({
      where: { id: 'rule-software' },
      update: {},
      create: {
        id: 'rule-software',
        name: 'Software rule',
        vendorPattern: 'quickbooks',
        categoryId: softwareCategory?.id,
        condition: { category: 'Software' }
      }
    })
  ]);

  await prisma.monthlySummary.upsert({
    where: { year_month: { year: 2026, month: 6 } },
    update: {},
    create: {
      year: 2026,
      month: 6,
      totalAmount: 12850,
      taxAmount: 1440,
      materialAmount: 6000,
      toolAmount: 1850,
      fuelAmount: 2100,
      mealsAmount: 900,
      officeAmount: 350,
      softwareAmount: 650,
      marketingAmount: 0,
      miscAmount: 1000,
      businessCardAmount: 9850,
      personalCardAmount: 3000,
      createdById: parget.id
    }
  });

  await prisma.report.createMany({
    data: [
      {
        type: ReportType.monthly,
        format: ReportFormat.pdf,
        periodStart: new Date('2026-06-01'),
        periodEnd: new Date('2026-06-30'),
        generatedById: parget.id,
        data: { seed: true }
      }
    ],
    skipDuplicates: true
  });

  await prisma.vendor.upsert({
    where: { normalizedName: 'home depot' },
    update: { categoryId: materialCategory?.id },
    create: { name: 'Home Depot', normalizedName: 'home depot', categoryId: materialCategory?.id, purchaseCount: 1, totalSpend: 282.5, lastSeenAt: new Date() }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
