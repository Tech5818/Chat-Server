/**
 * 유저 생성을 위한 인터페이스
 */
export interface ICreateUser {
  username: string;
  password: string;
  email: string;
}

/**
 *  유저 수정을 위한 인터페이스
 */
export interface IUpdateUser {
  username?: string;
  password?: string;
  email?: string;
}
