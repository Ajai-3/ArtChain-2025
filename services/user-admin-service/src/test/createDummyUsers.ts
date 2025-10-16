import { prisma } from './../infrastructure/db/prisma';
import bcrypt from 'bcrypt';
import { publishNotification } from '../infrastructure/messaging/rabbitmq';
import { NAMES } from './dummyUserNames';

const PASSWORD = '1q2w3e4r@A';

function generateUsername(name: string) {
  const parts = name.toLowerCase().split(' ');
  const base = parts.join('_');
  const randomNum = Math.floor(Math.random() * 1000); // ensure uniqueness
  return `${base}_${randomNum}`;
}

function generateEmail(name: string) {
  const parts = name.toLowerCase().split(' ');
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first}${last}@gmail.com`;
}

export async function createDummyUsers() {
  let createdCount = 0;

  while (createdCount < 150) {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const email = generateEmail(name);
    const username = generateUsername(name);
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    try {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (existingUser) {

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
          bio: '',
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
      console.log(`Created user ${createdCount}: ${username}`);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  }

  console.log('All 150 dummy users created successfully!');
}

createDummyUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
