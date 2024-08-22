import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

 // Create User with role 2
 async createUser(createUserDto: CreateUserDto): Promise<User> {
  const { email, password } = createUserDto;

  // Check if a user with the same email already exists
  const existingUser = await this.usersRepository.findOne({ where: { email } });

  if (existingUser) {
    // Throw an exception if the email is already taken
    throw new ConflictException('Email is already taken');
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create and save the new user with role 2 and hashed password
  const newUser = this.usersRepository.create({
    ...createUserDto,
    password: hashedPassword,
    role: 2,
  });
  
  return await this.usersRepository.save(newUser);
}


// Create Admin with role 1
async createAdmin(createUserDto: CreateUserDto): Promise<User> {
  const { email, password } = createUserDto;

  // Check if a user with the same email already exists
  const existingUser = await this.usersRepository.findOne({ where: { email } });

  if (existingUser) {
    // Throw an exception if the email is already taken
    throw new ConflictException('Email is already taken');
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create and save the new admin with role 1 and hashed password
  const newAdmin = this.usersRepository.create({
    ...createUserDto,
    password: hashedPassword,
    role: 1,
  });
  
  return await this.usersRepository.save(newAdmin);
}


  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('user123', user);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
