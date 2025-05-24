import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDto, UpdateUserDto } from '../types';

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

  public update(id: string, userData: UpdateUserDto): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...userData
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  public delete(id: string): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }
}

export const userRepository = new UserRepository();