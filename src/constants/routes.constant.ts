export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  VERIFICATION: "/verification",
  HISTORY: "/transactions",
  BARCODE: "/barcode",
  CARDS: "/cards",
  TRANSACTION: "/transactions",
  MENU: "/menu",
  NOTIFICATIONS: "/notifications",
  SHARE_CODE: "/share-code",
  SHARE_CODE_SUCCESS: "/share-code-success",
  ADD_TO_WALLET: "/add-to-wallet",
  ADD_TO_WALLET_SUCCESS: "/add-to-wallet-success",
  CONTACT_US: "/contact-us",
  LOST_CARD: "/lost-card",
  LOST_CARD_SUCCESS: "/lost-card-success",
  VOUCHERS: "/vouchers",
} as const;

export const MAIN_ROUTES = [
  ROUTES.HOME,
  ROUTES.BARCODE,
  ROUTES.HISTORY,
] as string[];
