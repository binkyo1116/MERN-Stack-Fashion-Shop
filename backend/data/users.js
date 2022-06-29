import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const users = [
  {
    name: 'Duy Phong',
    email: 'admin@admin.com',
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
    isAdmin: true,
  },
  {
    name: 'User1',
    email: 'user1@user.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'User2',
    email: 'user2@user.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
