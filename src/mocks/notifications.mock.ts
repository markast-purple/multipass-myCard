export type NotificationCategory = "updates" | "alerts";

export type NotificationItem = {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  date: string;
  read: boolean;
  voucherId?: string;
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    category: "updates",
    title: "תו הזהב עומד לפוג",
    description: "תוקף התו מסתיים ב-01/29. מומלץ לממש בקרוב.",
    date: "18/03/2026 09:10",
    read: false,
    voucherId: "mock_active_1",
  },
  {
    id: "notif_2",
    category: "updates",
    title: "יתרה עודכנה",
    description: "עודכן שימוש של 75₪ בכרטיס קולנוע לסוף שבוע.",
    date: "17/03/2026 20:05",
    read: true,
    voucherId: "mock_active_2",
  },
  {
    id: "notif_3",
    category: "updates",
    title: "תו חדש נוסף",
    description: "הנחת מנוי לחדר כושר נוסף לארנק שלך.",
    date: "16/03/2026 10:30",
    read: false,
    voucherId: "mock_active_4",
  },
  {
    id: "notif_4",
    category: "updates",
    title: "תחזוקה מתוכננת",
    description: "ביום 19/03/2026 בין 02:00-03:00 ייתכנו שיבושים.",
    date: "18/03/2026 08:00",
    read: false,
  },
  {
    id: "notif_5",
    category: "alerts",
    title: "מימוש הצליח",
    description: "המימוש ב'תו הזהב' הושלם בהצלחה.",
    date: "17/03/2026 16:50",
    read: true,
    voucherId: "mock_active_1",
  },
  {
    id: "notif_6",
    category: "alerts",
    title: "מימוש נכשל",
    description: "המימוש ב'תו הזהב' לא הושלם. נסה שוב או בדוק יתרה.",
    date: "17/03/2026 11:20",
    read: false,
    voucherId: "mock_active_1",
  },
  {
    id: "notif_7",
    category: "alerts",
    title: "מימוש חלקי",
    description: "בוצע מימוש חלקי בכרטיס קולנוע לסוף שבוע.",
    date: "15/03/2026 18:10",
    read: false,
    voucherId: "mock_active_2",
  },
];
