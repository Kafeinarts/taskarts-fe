/**
 * Indonesian National Holidays Database & Utilities (Tanggal Merah Indonesia)
 * Covers Fixed & Lunar/Moveable Public Holidays for Indonesia (SKB 3 Menteri)
 */

export const FIXED_HOLIDAYS = {
  '01-01': 'Tahun Baru Masehi',
  '05-01': 'Hari Buruh Internasional',
  '06-01': 'Hari Lahir Pancasila',
  '08-17': 'Hari Kemerdekaan Republik Indonesia',
  '12-25': 'Hari Raya Natal'
};

export const MOVEABLE_HOLIDAYS = {
  // 2024
  '2024-02-08': "Isra Mi'raj Nabi Muhammad SAW",
  '2024-02-10': 'Tahun Baru Imlek 2575 Kongzili',
  '2024-03-11': 'Hari Suci Nyepi (Tahun Baru Saka 1946)',
  '2024-03-29': 'Wafat Yesus Kristus (Jumat Agung)',
  '2024-03-31': 'Hari Paskah',
  '2024-04-10': 'Hari Raya Idul Fitri 1445 H (Hari 1)',
  '2024-04-11': 'Hari Raya Idul Fitri 1445 H (Hari 2)',
  '2024-05-09': 'Kenaikan Yesus Kristus',
  '2024-05-23': 'Hari Raya Waisak 2568 BE',
  '2024-06-17': 'Hari Raya Idul Adha 1445 H',
  '2024-07-07': 'Tahun Baru Islam 1446 H',
  '2024-09-16': 'Maulid Nabi Muhammad SAW',

  // 2025
  '2025-01-27': "Isra Mi'raj Nabi Muhammad SAW",
  '2025-01-29': 'Tahun Baru Imlek 2576 Kongzili',
  '2025-03-29': 'Hari Suci Nyepi (Tahun Baru Saka 1947)',
  '2025-03-31': 'Hari Raya Idul Fitri 1446 H (Hari 1)',
  '2025-04-01': 'Hari Raya Idul Fitri 1446 H (Hari 2)',
  '2025-04-18': 'Wafat Yesus Kristus (Jumat Agung)',
  '2025-05-12': 'Hari Raya Waisak 2569 BE',
  '2025-05-29': 'Kenaikan Yesus Kristus',
  '2025-06-06': 'Hari Raya Idul Adha 1446 H',
  '2025-06-27': '1 Muharam / Tahun Baru Islam 1447 H',
  '2025-09-05': 'Maulid Nabi Muhammad SAW',

  // 2026
  '2026-01-16': "Isra Mi'raj Nabi Muhammad SAW",
  '2026-02-17': 'Tahun Baru Imlek 2577 Kongzili',
  '2026-03-19': 'Hari Suci Nyepi (Tahun Baru Saka 1948)',
  '2026-03-20': 'Hari Raya Idul Fitri 1447 H (Hari 1)',
  '2026-03-21': 'Hari Raya Idul Fitri 1447 H (Hari 2)',
  '2026-04-03': 'Wafat Yesus Kristus (Jumat Agung)',
  '2026-05-14': 'Kenaikan Yesus Kristus',
  '2026-05-27': 'Hari Raya Idul Adha 1447 H',
  '2026-05-31': 'Hari Raya Waisak 2570 BE',
  '2026-06-16': '1 Muharam / Tahun Baru Islam 1448 H',
  '2026-08-25': 'Maulid Nabi Muhammad SAW',

  // 2027
  '2027-01-05': "Isra Mi'raj Nabi Muhammad SAW",
  '2027-02-06': 'Tahun Baru Imlek 2578 Kongzili',
  '2027-03-09': 'Hari Raya Idul Fitri 1448 H',
  '2027-03-26': 'Wafat Yesus Kristus (Jumat Agung)',
  '2027-05-06': 'Kenaikan Yesus Kristus',
  '2027-05-16': 'Hari Raya Idul Adha 1448 H',
  '2027-05-20': 'Hari Raya Waisak 2571 BE',
  '2027-06-06': 'Tahun Baru Islam 1449 H'
};

/**
 * Check if a date is an Indonesian National Holiday (Tanggal Merah) or Sunday
 * @param {string|Date} dateParam - Date string YYYY-MM-DD or Date object
 * @returns {{ isRedDate: boolean, isHoliday: boolean, isSunday: boolean, holidayName: string|null }}
 */
export function getIndonesianHolidayInfo(dateParam) {
  if (!dateParam) {
    return { isRedDate: false, isHoliday: false, isSunday: false, holidayName: null };
  }

  let dateObj;
  let isoDateStr = '';

  if (typeof dateParam === 'string') {
    isoDateStr = dateParam.split('T')[0];
    const [year, month, day] = isoDateStr.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = dateParam;
    isoDateStr = dateObj.toISOString().split('T')[0];
  }

  const isSunday = dateObj.getDay() === 0;

  // Check moveable holidays first (full date match)
  if (MOVEABLE_HOLIDAYS[isoDateStr]) {
    return {
      isRedDate: true,
      isHoliday: true,
      isSunday,
      holidayName: MOVEABLE_HOLIDAYS[isoDateStr]
    };
  }

  // Check fixed annual holidays (MM-DD match)
  const mmDd = isoDateStr.slice(5); // "MM-DD"
  if (FIXED_HOLIDAYS[mmDd]) {
    return {
      isRedDate: true,
      isHoliday: true,
      isSunday,
      holidayName: FIXED_HOLIDAYS[mmDd]
    };
  }

  return {
    isRedDate: isSunday,
    isHoliday: false,
    isSunday,
    holidayName: isSunday ? 'Hari Minggu' : null
  };
}
