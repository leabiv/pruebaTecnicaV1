import bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string): Promise<string> => {
  const cont = await bcrypt.genSalt(10);
  return bcrypt.hash(password, cont)
}
