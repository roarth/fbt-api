import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    const user = this.create();
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if(error.code === '23505') { // duplicate email
        throw new ConflictException(`Email ${email} already exists`)
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;

    const user = await this.findOne({ email });

    if(user && await user.validatePassword(password)) {
      return user.email;
    } else {
      return null;
    }
  }

  /**
   * Hash the password with the generated salt
   *
   * @param password
   * @param salt
   */
  private async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

}
