type Subscription = { active: boolean };

interface IUser {
  fullName: string;
  displayPicture: string;
  email: string;
  subscription: Subscription;
  createdAt: string;
  updatedAt: string;
}

export type { IUser };
