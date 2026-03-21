import { prisma } from './../infrastructure/db/prisma';
import bcrypt from 'bcrypt';
import { publishNotification } from '../infrastructure/messaging/rabbitmq';
import { NAMES } from './dummyUserNames';

const PASSWORD = '1q2w3e4r@A';

function generateUsername(name: string) {
  return name.toLowerCase().split(' ').join('_');
}

function generateEmail(name: string) {
  const parts = name.toLowerCase().split(' ');
  return `${parts.join('')}@gmail.com`;
}

export async function createDummyUsers() {
  let createdCount = 0;

  console.log(
    `🚀 Starting sequential creation of ${NAMES.length} unique users...`,
  );

  for (const name of NAMES) {
    const email = generateEmail(name);
    const username = generateUsername(name);
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    try {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (existingUser) {
        console.log(`⏩ Skipping: ${username} (Already exists)`);
        continue;
      }

      const user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          phone: '',
          role: 'user',
          plan: 'free',
          status: 'active',
          isVerified: true,
          profileImage: '',
          bannerImage: '',
          backgroundImage: '',
          bio: `Hi, I am ${name}. Welcome to my ArtChain profile!`,
          country: '',
        },
      });

      const elasticUser = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || '',
        bannerImage: user.bannerImage || '',
        bio: user.bio || '',
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      };

      await publishNotification('user.created', elasticUser);

      createdCount++;
      console.log(`Created user ${createdCount}/${NAMES.length}: ${username}`);
    } catch (err) {
      console.error(`❌ Error creating ${name}:`, err);
    }
  }

  console.log(
    `✅ Finished! Created ${createdCount} clean, unique dummy users.`,
  );
}

createDummyUsers()
  .then(() => {
    setTimeout(() => process.exit(0), 2000);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
