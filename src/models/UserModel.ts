export interface UserModel {
  id: string;
  name: string;
  email: string;
  nickname: string;
  password?: string;
  favoriteComicsIds: Array<string>;
}
