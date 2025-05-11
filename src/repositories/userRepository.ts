import { User } from '../types';

class UserRepository {
  private users: User[] = [];

  public findAll(): User[] {
    return [...this.users];
  }

  public findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }
}

export const userRepository = new UserRepository();