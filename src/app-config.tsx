export const appConfig: {
  mode: 'comingSoon' | 'maintenance' | 'live';
} = {
  mode: 'live'
};

export const protectedRoutes = ['/purchases', '/dashboard/'];
export const allowedUsers = [
  'john@webandprosper.co.uk',
  'johnspaul63@gmail.com',
  'john@bernardimusicgroup.com',
  'jon@morgan-jones.com'
];
export const bannedUsers = ['none'];
export const applicationName = 'GigCanvas';
export const companyName = 'GigCanvas';

export const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5;
export const MAX_UPLOAD_IMAGE_SIZE = 1024 * 1024 * MAX_UPLOAD_IMAGE_SIZE_IN_MB;
export const MAX_UPLOAD_DOCUMENT_SIZE_IN_MB = 5;

export const TOKEN_LENGTH = 32;
export const TOKEN_TTL = 1000 * 60 * 5; // 5 min
export const VERIFY_EMAIL_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

export const MAX_GROUP_LIMIT = 10;
export const MAX_GROUP_PREMIUM_LIMIT = 50;

export const afterLoginUrl = '/dashboard';
