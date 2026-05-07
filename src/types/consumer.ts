export interface Consumer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  riskScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumerParams {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}
