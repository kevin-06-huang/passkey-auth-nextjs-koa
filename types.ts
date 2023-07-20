export type TwoFactorModalProps = {
  username: string;
  otpAuthUrl: string;
  closeModal: () => void;
};

export type KoaRequestBody = {
  username: string;
  password?: string;
  token?: string | undefined;
};

export interface IUser {
  username: string;
}
