export interface IRole {
  id: number,
  appKey: string,
  name: string,
  isActive: number,
  isDel: number
}

export interface IUserType {
  userId: string,
  nickname: string,
  male: number,
  headImageUrl: string,
  business: number,
  roleDescribe?: string,
  userDescribe?: string,
  role: Array<IRole>
}