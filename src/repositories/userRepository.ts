import { User } from '../types';

class UserRepository {
  private users: User[] = [];

  public findAll(): User[] {
    return [...this.users];
  }
}

export const userRepository = new UserRepository();