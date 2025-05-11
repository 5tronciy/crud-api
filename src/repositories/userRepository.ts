import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDto } from '../types';

class UserRepository {
  private users: User[] = [];

  public findAll(): User[] {
    return [...this.users];
  }

  public findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  public create(userData: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }
}

export const userRepository = new UserRepository();