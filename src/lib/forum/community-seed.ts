/**
 * Topluluk başlangıç içeriği (15 üye + kategorilere konular).
 * ensureCommunitySeed ile bir kez enjekte edilir.
 * Demo giriş şifresi (tüm seed üyeler): Konya2026a
 */
import type { Post, Thread } from "@/lib/forum/data";
import type { Member } from "@/lib/members/store";

export const COMMUNITY_SEED_FLAG = "konyago-community-seed-v3";
export const COMMUNITY_DEMO_PASSWORD = "Konya2026a";

export const COMMUNITY_NAMES: Record<string, string> = {
  "mbr_seed_01": "Ahmet Yılmaz",
  "mbr_seed_02": "Elif Demir",
  "mbr_seed_03": "Mehmet Kaya",
  "mbr_seed_04": "Zeynep Arslan",
  "mbr_seed_05": "Mustafa Çelik",
  "mbr_seed_06": "Ayşe Öztürk",
  "mbr_seed_07": "Emre Şahin",
  "mbr_seed_08": "Fatma Aydın",
  "mbr_seed_09": "Burak Yıldız",
  "mbr_seed_10": "Merve Koç",
  "mbr_seed_11": "Hakan Acar",
  "mbr_seed_12": "Selin Doğan",
  "mbr_seed_13": "Can Özkan",
  "mbr_seed_14": "Deniz Kurt",
  "mbr_seed_15": "İrem Polat"
};

export const COMMUNITY_MEMBERS: Member[] = [
  {
    "id": "mbr_seed_01",
    "email": "uye01.arsiv@konyago.demo",
    "displayName": "Ahmet Yılmaz",
    "passwordHash": "1c681e1049dbd1ada50553fd4765d319c468b78f4d73d510c5d651a85768fac8",
    "createdAt": "2026-07-20T06:05:00.000Z",
    "updatedAt": "2026-07-20T06:05:00.000Z",
    "lastLoginAt": "2026-08-09T09:00:10.000Z",
    "activity": {
      "totalMinutes": 45,
      "dayMinutes": 12,
      "dayKey": "2026-08-09",
      "activeDays": 2,
      "streakDays": 1,
      "lastTickAt": "2026-08-09T11:00:20.000Z"
    },
    "profile": {
      "bio": "Hafta sonu rota ve gezi planları yapmayı severim.",
      "city": "Konya",
      "district": "Selçuklu",
      "website": "",
      "locationNote": "Selçuklu"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_02",
    "email": "uye02.arsiv@konyago.demo",
    "displayName": "Elif Demir",
    "passwordHash": "d05bdaeed44d89b87f2924f90e6d1e9fe55368106fd418865e3873d7134e75ae",
    "createdAt": "2026-07-21T08:16:03.000Z",
    "updatedAt": "2026-07-21T08:16:03.000Z",
    "lastLoginAt": "2026-08-08T10:17:11.000Z",
    "activity": {
      "totalMinutes": 82,
      "dayMinutes": 13,
      "dayKey": "2026-08-09",
      "activeDays": 3,
      "streakDays": 2,
      "lastTickAt": "2026-08-09T12:09:20.000Z"
    },
    "profile": {
      "bio": "Meram tarafında yaşıyorum; yürüyüş ve kahve molası.",
      "city": "Konya",
      "district": "Meram",
      "website": "",
      "locationNote": "Meram"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_03",
    "email": "uye03.arsiv@konyago.demo",
    "displayName": "Mehmet Kaya",
    "passwordHash": "83185accfaf6de6c251f74cbe15c4da47da73cab9a48712f42549377d88b8330",
    "createdAt": "2026-07-22T10:27:06.000Z",
    "updatedAt": "2026-07-22T10:27:06.000Z",
    "lastLoginAt": "2026-08-07T11:34:12.000Z",
    "activity": {
      "totalMinutes": 119,
      "dayMinutes": 14,
      "dayKey": "2026-08-09",
      "activeDays": 4,
      "streakDays": 3,
      "lastTickAt": "2026-08-09T13:18:20.000Z"
    },
    "profile": {
      "bio": "Tarih ve müze gezisi notları tutuyorum.",
      "city": "Konya",
      "district": "Karatay",
      "website": "",
      "locationNote": "Karatay"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_04",
    "email": "uye04.arsiv@konyago.demo",
    "displayName": "Zeynep Arslan",
    "passwordHash": "7d007536f95607c2fccdac9c086d1d1a78ef9215a26db41160e93a668398c065",
    "createdAt": "2026-07-23T12:38:09.000Z",
    "updatedAt": "2026-07-23T12:38:09.000Z",
    "lastLoginAt": "2026-08-06T12:51:13.000Z",
    "activity": {
      "totalMinutes": 156,
      "dayMinutes": 15,
      "dayKey": "2026-08-09",
      "activeDays": 5,
      "streakDays": 4,
      "lastTickAt": "2026-08-09T14:27:20.000Z"
    },
    "profile": {
      "bio": "Sille ve taş sokaklar, kahvaltı önerileri.",
      "city": "Konya",
      "district": "Sille",
      "website": "",
      "locationNote": "Sille"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_05",
    "email": "uye05.arsiv@konyago.demo",
    "displayName": "Mustafa Çelik",
    "passwordHash": "bd6d60237308b8c43ed209efe1aaf25566abfaf38974ccfa9c4dd4a4418e6318",
    "createdAt": "2026-07-24T14:49:12.000Z",
    "updatedAt": "2026-07-24T14:49:12.000Z",
    "lastLoginAt": "2026-08-09T13:13:14.000Z",
    "activity": {
      "totalMinutes": 193,
      "dayMinutes": 16,
      "dayKey": "2026-08-09",
      "activeDays": 6,
      "streakDays": 1,
      "lastTickAt": "2026-08-09T15:36:20.000Z"
    },
    "profile": {
      "bio": "Konya mutfağı ve fırın lezzetleri meraklısı.",
      "city": "Konya",
      "district": "Merkez",
      "website": "",
      "locationNote": "Merkez"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_06",
    "email": "uye06.arsiv@konyago.demo",
    "displayName": "Ayşe Öztürk",
    "passwordHash": "73665d355a5c0ddbd51361f44620a4a1d819ca1ef1d2612e974099cf31040b49",
    "createdAt": "2026-07-25T06:10:15.000Z",
    "updatedAt": "2026-07-25T06:10:15.000Z",
    "lastLoginAt": "2026-08-08T14:30:15.000Z",
    "activity": {
      "totalMinutes": 230,
      "dayMinutes": 17,
      "dayKey": "2026-08-09",
      "activeDays": 7,
      "streakDays": 2,
      "lastTickAt": "2026-08-09T11:45:20.000Z"
    },
    "profile": {
      "bio": "Ulaşım, tramvay ve şehir içi pratik bilgiler.",
      "city": "Konya",
      "district": "Selçuklu",
      "website": "",
      "locationNote": "Selçuklu"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_07",
    "email": "uye07.arsiv@konyago.demo",
    "displayName": "Emre Şahin",
    "passwordHash": "994dfa1662819d5498d9961dcd9ac4b637da254a168f728f0e2c758f59f09783",
    "createdAt": "2026-07-26T08:21:18.000Z",
    "updatedAt": "2026-07-26T08:21:18.000Z",
    "lastLoginAt": "2026-08-07T15:47:16.000Z",
    "activity": {
      "totalMinutes": 267,
      "dayMinutes": 18,
      "dayKey": "2026-08-09",
      "activeDays": 2,
      "streakDays": 3,
      "lastTickAt": "2026-08-09T12:04:20.000Z"
    },
    "profile": {
      "bio": "Fotoğraf çekmeyi severim; altın saat avcısıyım.",
      "city": "Konya",
      "district": "Karatay",
      "website": "",
      "locationNote": "Karatay"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_08",
    "email": "uye08.arsiv@konyago.demo",
    "displayName": "Fatma Aydın",
    "passwordHash": "d9c9f3eec3e8542dc983ba32ce085e2ee2bc5c897659b6e8705ef72667309330",
    "createdAt": "2026-07-27T10:32:21.000Z",
    "updatedAt": "2026-07-27T10:32:21.000Z",
    "lastLoginAt": "2026-08-06T16:09:17.000Z",
    "activity": {
      "totalMinutes": 304,
      "dayMinutes": 19,
      "dayKey": "2026-08-09",
      "activeDays": 3,
      "streakDays": 4,
      "lastTickAt": "2026-08-09T13:13:20.000Z"
    },
    "profile": {
      "bio": "Selçuklu mirası ve şehir arşivi ilgilisi.",
      "city": "Konya",
      "district": "Merkez",
      "website": "",
      "locationNote": "Merkez"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_09",
    "email": "uye09.arsiv@konyago.demo",
    "displayName": "Burak Yıldız",
    "passwordHash": "69e8096dcf165861fb12e6ac22db326a3518afb942519e3f02f44e98311b306a",
    "createdAt": "2026-07-28T12:43:24.000Z",
    "updatedAt": "2026-07-28T12:43:24.000Z",
    "lastLoginAt": "2026-08-09T09:26:18.000Z",
    "activity": {
      "totalMinutes": 341,
      "dayMinutes": 20,
      "dayKey": "2026-08-09",
      "activeDays": 4,
      "streakDays": 1,
      "lastTickAt": "2026-08-09T14:22:20.000Z"
    },
    "profile": {
      "bio": "Mevlana çevresi ziyaret notları.",
      "city": "Konya",
      "district": "Karatay",
      "website": "",
      "locationNote": "Karatay"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_10",
    "email": "uye10.arsiv@konyago.demo",
    "displayName": "Merve Koç",
    "passwordHash": "dcf5760e8c9e2323ff1052dde066cea81df20d6cf772b283170de7112966bf06",
    "createdAt": "2026-07-29T14:54:27.000Z",
    "updatedAt": "2026-07-29T14:54:27.000Z",
    "lastLoginAt": "2026-08-08T10:43:19.000Z",
    "activity": {
      "totalMinutes": 378,
      "dayMinutes": 21,
      "dayKey": "2026-08-09",
      "activeDays": 5,
      "streakDays": 2,
      "lastTickAt": "2026-08-09T15:31:20.000Z"
    },
    "profile": {
      "bio": "Öğrenci; kampüs ve etkinlik takipçisi.",
      "city": "Konya",
      "district": "Selçuklu",
      "website": "",
      "locationNote": "Selçuklu"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_11",
    "email": "uye11.arsiv@konyago.demo",
    "displayName": "Hakan Acar",
    "passwordHash": "f054f990479b54ff02bc089ad56f805b62cece8c0d006f95e0d2341e61d0f923",
    "createdAt": "2026-07-30T06:15:30.000Z",
    "updatedAt": "2026-07-30T06:15:30.000Z",
    "lastLoginAt": "2026-08-07T11:05:20.000Z",
    "activity": {
      "totalMinutes": 415,
      "dayMinutes": 22,
      "dayKey": "2026-08-09",
      "activeDays": 6,
      "streakDays": 3,
      "lastTickAt": "2026-08-09T11:40:20.000Z"
    },
    "profile": {
      "bio": "İş ve staj arayanlara deneyim paylaşırım.",
      "city": "Konya",
      "district": "Selçuklu",
      "website": "",
      "locationNote": "Selçuklu"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_12",
    "email": "uye12.arsiv@konyago.demo",
    "displayName": "Selin Doğan",
    "passwordHash": "e0f61f3c9cbc24414bcb6f3a74f07e0c879aae85f06d7d8efd3898d7657620ec",
    "createdAt": "2026-07-31T08:26:33.000Z",
    "updatedAt": "2026-07-31T08:26:33.000Z",
    "lastLoginAt": "2026-08-06T12:22:21.000Z",
    "activity": {
      "totalMinutes": 452,
      "dayMinutes": 23,
      "dayKey": "2026-08-09",
      "activeDays": 7,
      "streakDays": 4,
      "lastTickAt": "2026-08-09T12:49:20.000Z"
    },
    "profile": {
      "bio": "İkinci el ve güvenli buluşma notları.",
      "city": "Konya",
      "district": "Meram",
      "website": "",
      "locationNote": "Meram"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_13",
    "email": "uye13.arsiv@konyago.demo",
    "displayName": "Can Özkan",
    "passwordHash": "53d7e6b3952af1f85f86ef2a423998b5459ac2087895af2ed7e0804bf7dd8dc0",
    "createdAt": "2026-08-01T10:37:36.000Z",
    "updatedAt": "2026-08-01T10:37:36.000Z",
    "lastLoginAt": "2026-08-09T13:39:22.000Z",
    "activity": {
      "totalMinutes": 489,
      "dayMinutes": 24,
      "dayKey": "2026-08-09",
      "activeDays": 2,
      "streakDays": 1,
      "lastTickAt": "2026-08-09T13:08:20.000Z"
    },
    "profile": {
      "bio": "Ailece gezi ve çocuklu rota planları.",
      "city": "Konya",
      "district": "Karatay",
      "website": "",
      "locationNote": "Karatay"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_14",
    "email": "uye14.arsiv@konyago.demo",
    "displayName": "Deniz Kurt",
    "passwordHash": "cf201e88ed2efdd3a60a87eb6c672d710933222ffe98df8425a580c04561b543",
    "createdAt": "2026-08-02T12:48:39.000Z",
    "updatedAt": "2026-08-02T12:48:39.000Z",
    "lastLoginAt": "2026-08-08T14:01:23.000Z",
    "activity": {
      "totalMinutes": 526,
      "dayMinutes": 25,
      "dayKey": "2026-08-09",
      "activeDays": 3,
      "streakDays": 2,
      "lastTickAt": "2026-08-09T14:17:20.000Z"
    },
    "profile": {
      "bio": "Akşam güzergâhları ve sakin mekanlar.",
      "city": "Konya",
      "district": "Meram",
      "website": "",
      "locationNote": "Meram"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  },
  {
    "id": "mbr_seed_15",
    "email": "uye15.arsiv@konyago.demo",
    "displayName": "İrem Polat",
    "passwordHash": "e2292f84d9b0a21125388df45579393ca908591a319c64f7b588f31b59ddcd9b",
    "createdAt": "2026-08-03T14:09:42.000Z",
    "updatedAt": "2026-08-03T14:09:42.000Z",
    "lastLoginAt": "2026-08-07T15:18:24.000Z",
    "activity": {
      "totalMinutes": 563,
      "dayMinutes": 26,
      "dayKey": "2026-08-09",
      "activeDays": 4,
      "streakDays": 3,
      "lastTickAt": "2026-08-09T15:26:20.000Z"
    },
    "profile": {
      "bio": "Şehre yeni taşınanlar için pratik rehber.",
      "city": "Konya",
      "district": "Selçuklu",
      "website": "",
      "locationNote": "Selçuklu"
    },
    "prefs": {
      "showEmail": false,
      "notifyModeration": true,
      "notifyListings": true,
      "preferCompactLists": false
    }
  }
] as Member[];

export const COMMUNITY_THREADS: Thread[] = [
  {
    "id": "seed_th_01",
    "categoryId": "rotalar",
    "title": "Konya’da 1 günde ne yapılır? Pratik rota",
    "authorId": "mbr_seed_01",
    "createdAt": "2026-07-24T06:14:00.000Z",
    "lastPostAt": "2026-07-24T06:14:00.000Z",
    "lastPosterId": "mbr_seed_01",
    "replies": 0,
    "views": 104,
    "status": "approved",
    "tags": [
      "konya",
      "öneri"
    ],
    "hot": true,
    "featured": true
  },
  {
    "id": "seed_th_02",
    "categoryId": "gezi",
    "title": "İnce Minare ve Karatay Medresesi saatleri",
    "authorId": "mbr_seed_01",
    "createdAt": "2026-07-25T08:42:13.000Z",
    "lastPostAt": "2026-07-25T12:00:11.000Z",
    "lastPosterId": "mbr_seed_05",
    "replies": 1,
    "views": 113,
    "status": "approved",
    "tags": [
      "soru"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_03",
    "categoryId": "semt",
    "title": "Meram’da akşam yürüyüş güzergâhı",
    "authorId": "mbr_seed_02",
    "createdAt": "2026-07-25T17:08:26.000Z",
    "lastPostAt": "2026-07-26T07:27:22.000Z",
    "lastPosterId": "mbr_seed_07",
    "replies": 1,
    "views": 116,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_04",
    "categoryId": "mutfak",
    "title": "Meram’da etli ekmek fırın önerileri",
    "authorId": "mbr_seed_02",
    "createdAt": "2026-07-26T05:27:39.000Z",
    "lastPostAt": "2026-07-26T05:27:39.000Z",
    "lastPosterId": "mbr_seed_02",
    "replies": 0,
    "views": 101,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_05",
    "categoryId": "mevlana",
    "title": "Mevlana Müzesi ilk ziyaret listesi",
    "authorId": "mbr_seed_03",
    "createdAt": "2026-07-26T10:55:02.000Z",
    "lastPostAt": "2026-07-26T13:16:44.000Z",
    "lastPosterId": "mbr_seed_10",
    "replies": 1,
    "views": 116,
    "status": "approved",
    "tags": [
      "konya",
      "öneri"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_06",
    "categoryId": "tarih",
    "title": "Selçuklu eserlerini gezme sırası",
    "authorId": "mbr_seed_03",
    "createdAt": "2026-07-27T07:03:15.000Z",
    "lastPostAt": "2026-07-27T15:25:05.000Z",
    "lastPosterId": "mbr_seed_06",
    "replies": 1,
    "views": 113,
    "status": "approved",
    "tags": [
      "soru"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_07",
    "categoryId": "semt",
    "title": "Sille kahvaltı ve taş sokak turu",
    "authorId": "mbr_seed_04",
    "createdAt": "2026-07-27T15:41:28.000Z",
    "lastPostAt": "2026-07-27T15:41:28.000Z",
    "lastPosterId": "mbr_seed_04",
    "replies": 0,
    "views": 87,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_08",
    "categoryId": "foto",
    "title": "Sille’de fotoğraf köşeleri",
    "authorId": "mbr_seed_04",
    "createdAt": "2026-07-28T04:52:41.000Z",
    "lastPostAt": "2026-07-28T16:16:27.000Z",
    "lastPosterId": "mbr_seed_09",
    "replies": 1,
    "views": 96,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_09",
    "categoryId": "mutfak",
    "title": "Etli ekmek dışında Konya lezzetleri",
    "authorId": "mbr_seed_05",
    "createdAt": "2026-07-28T13:19:04.000Z",
    "lastPostAt": "2026-07-28T16:44:38.000Z",
    "lastPosterId": "mbr_seed_11",
    "replies": 1,
    "views": 99,
    "status": "approved",
    "tags": [
      "konya",
      "öneri"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_10",
    "categoryId": "genel",
    "title": "Konya’ya yeni gelenlere 5 kural",
    "authorId": "mbr_seed_05",
    "createdAt": "2026-07-29T06:33:17.000Z",
    "lastPostAt": "2026-07-29T06:33:17.000Z",
    "lastPosterId": "mbr_seed_05",
    "replies": 0,
    "views": 84,
    "status": "approved",
    "tags": [
      "soru"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_11",
    "categoryId": "ulasim",
    "title": "Tramvay ve otobüs aktarma ipuçları",
    "authorId": "mbr_seed_06",
    "createdAt": "2026-07-29T18:06:30.000Z",
    "lastPostAt": "2026-07-30T03:33:10.000Z",
    "lastPosterId": "mbr_seed_09",
    "replies": 1,
    "views": 99,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_12",
    "categoryId": "ulasim",
    "title": "Otogar’dan merkeze pratik yol",
    "authorId": "mbr_seed_06",
    "createdAt": "2026-07-30T09:48:43.000Z",
    "lastPostAt": "2026-07-30T12:16:21.000Z",
    "lastPosterId": "mbr_seed_10",
    "replies": 1,
    "views": 96,
    "status": "approved",
    "hot": true,
    "featured": false
  },
  {
    "id": "seed_th_13",
    "categoryId": "foto",
    "title": "Konya silueti: altın saat noktaları",
    "authorId": "mbr_seed_07",
    "createdAt": "2026-07-30T16:22:06.000Z",
    "lastPostAt": "2026-07-30T16:22:06.000Z",
    "lastPosterId": "mbr_seed_07",
    "replies": 0,
    "views": 70,
    "status": "approved",
    "tags": [
      "konya",
      "öneri"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_14",
    "categoryId": "haber",
    "title": "Bu hafta şehirde gördüğünüz yenilikler",
    "authorId": "mbr_seed_07",
    "createdAt": "2026-07-31T05:11:19.000Z",
    "lastPostAt": "2026-07-31T09:41:43.000Z",
    "lastPosterId": "mbr_seed_13",
    "replies": 1,
    "views": 79,
    "status": "approved",
    "tags": [
      "soru"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_15",
    "categoryId": "tarih",
    "title": "Az bilinen tarihî yapılar",
    "authorId": "mbr_seed_08",
    "createdAt": "2026-07-31T11:37:32.000Z",
    "lastPostAt": "2026-07-31T18:08:04.000Z",
    "lastPosterId": "mbr_seed_15",
    "replies": 1,
    "views": 82,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_16",
    "categoryId": "genel",
    "title": "Foruma nasıl verimli konu açılır?",
    "authorId": "mbr_seed_08",
    "createdAt": "2026-08-01T07:59:45.000Z",
    "lastPostAt": "2026-08-01T07:59:45.000Z",
    "lastPosterId": "mbr_seed_08",
    "replies": 0,
    "views": 67,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_17",
    "categoryId": "mevlana",
    "title": "Sema gösterisi izleme notları",
    "authorId": "mbr_seed_09",
    "createdAt": "2026-08-01T14:04:08.000Z",
    "lastPostAt": "2026-08-02T00:37:26.000Z",
    "lastPosterId": "mbr_seed_13",
    "replies": 1,
    "views": 82,
    "status": "approved",
    "tags": [
      "konya",
      "öneri"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_18",
    "categoryId": "etkinlik",
    "title": "Konser ve kültür takvimi takibi",
    "authorId": "mbr_seed_09",
    "createdAt": "2026-08-02T06:28:21.000Z",
    "lastPostAt": "2026-08-02T12:02:37.000Z",
    "lastPosterId": "mbr_seed_14",
    "replies": 1,
    "views": 62,
    "status": "approved",
    "tags": [
      "soru"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_19",
    "categoryId": "etkinlik",
    "title": "Kampüs çevresi öğrenci etkinlikleri",
    "authorId": "mbr_seed_10",
    "createdAt": "2026-08-02T19:15:34.000Z",
    "lastPostAt": "2026-08-02T19:15:34.000Z",
    "lastPosterId": "mbr_seed_10",
    "replies": 0,
    "views": 53,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_20",
    "categoryId": "yardim",
    "title": "Yeni üye rehberi: ilk adımlar",
    "authorId": "mbr_seed_10",
    "createdAt": "2026-08-03T08:07:47.000Z",
    "lastPostAt": "2026-08-03T10:43:09.000Z",
    "lastPosterId": "mbr_seed_02",
    "replies": 1,
    "views": 62,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_21",
    "categoryId": "genel",
    "title": "Staj ve ilk iş arayanlara tavsiye",
    "authorId": "mbr_seed_11",
    "createdAt": "2026-08-03T12:44:10.000Z",
    "lastPostAt": "2026-08-04T01:21:20.000Z",
    "lastPosterId": "mbr_seed_14",
    "replies": 1,
    "views": 65,
    "status": "approved",
    "tags": [
      "konya",
      "öneri"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_22",
    "categoryId": "sicak",
    "title": "2026 yazında Konya yapılacaklar",
    "authorId": "mbr_seed_11",
    "createdAt": "2026-08-04T05:51:23.000Z",
    "lastPostAt": "2026-08-04T05:51:23.000Z",
    "lastPosterId": "mbr_seed_11",
    "replies": 0,
    "views": 50,
    "status": "approved",
    "tags": [
      "soru"
    ],
    "hot": true,
    "featured": false
  },
  {
    "id": "seed_th_23",
    "categoryId": "semt",
    "title": "İkinci el için güvenli buluşma yerleri",
    "authorId": "mbr_seed_12",
    "createdAt": "2026-08-04T16:13:36.000Z",
    "lastPostAt": "2026-08-04T19:52:42.000Z",
    "lastPosterId": "mbr_seed_02",
    "replies": 1,
    "views": 65,
    "status": "approved",
    "hot": true,
    "featured": false
  },
  {
    "id": "seed_th_24",
    "categoryId": "yardim",
    "title": "İlan verirken dikkat listesi",
    "authorId": "mbr_seed_12",
    "createdAt": "2026-08-05T07:26:49.000Z",
    "lastPostAt": "2026-08-05T14:43:03.000Z",
    "lastPosterId": "mbr_seed_03",
    "replies": 1,
    "views": 45,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_25",
    "categoryId": "rotalar",
    "title": "Çocuklu aile 1 günlük plan",
    "authorId": "mbr_seed_13",
    "createdAt": "2026-08-05T10:09:12.000Z",
    "lastPostAt": "2026-08-05T10:09:12.000Z",
    "lastPosterId": "mbr_seed_13",
    "replies": 0,
    "views": 36,
    "status": "approved",
    "tags": [
      "konya",
      "öneri"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_26",
    "categoryId": "gezi",
    "title": "Günübirlik doğa kaçamağı",
    "authorId": "mbr_seed_13",
    "createdAt": "2026-08-06T06:18:25.000Z",
    "lastPostAt": "2026-08-06T15:37:25.000Z",
    "lastPosterId": "mbr_seed_01",
    "replies": 1,
    "views": 45,
    "status": "approved",
    "tags": [
      "soru"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_27",
    "categoryId": "semt",
    "title": "Akşam merkezde güvenli dolaşım",
    "authorId": "mbr_seed_14",
    "createdAt": "2026-08-06T13:52:38.000Z",
    "lastPostAt": "2026-08-06T16:12:36.000Z",
    "lastPosterId": "mbr_seed_03",
    "replies": 1,
    "views": 48,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_28",
    "categoryId": "mutfak",
    "title": "Geç saat açık tatlı / çay yerleri",
    "authorId": "mbr_seed_14",
    "createdAt": "2026-08-07T08:34:01.000Z",
    "lastPostAt": "2026-08-07T08:34:01.000Z",
    "lastPosterId": "mbr_seed_14",
    "replies": 0,
    "views": 33,
    "status": "approved",
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_29",
    "categoryId": "genel",
    "title": "Yeni taşındım: semt seçimi",
    "authorId": "mbr_seed_15",
    "createdAt": "2026-08-07T17:47:14.000Z",
    "lastPostAt": "2026-08-07T22:09:08.000Z",
    "lastPosterId": "mbr_seed_06",
    "replies": 1,
    "views": 48,
    "status": "approved",
    "tags": [
      "konya",
      "öneri"
    ],
    "hot": false,
    "featured": false
  },
  {
    "id": "seed_th_30",
    "categoryId": "sicak",
    "title": "Arşiv’de ilk hafta hedefleri",
    "authorId": "mbr_seed_15",
    "createdAt": "2026-08-08T05:05:27.000Z",
    "lastPostAt": "2026-08-08T16:28:19.000Z",
    "lastPosterId": "mbr_seed_07",
    "replies": 1,
    "views": 28,
    "status": "approved",
    "tags": [
      "soru"
    ],
    "hot": true,
    "featured": false
  }
] as Thread[];

export const COMMUNITY_POSTS: Post[] = [
  {
    "id": "seed_p_01a",
    "threadId": "seed_th_01",
    "authorId": "mbr_seed_01",
    "createdAt": "2026-07-24T06:14:00.000Z",
    "body": "Sabah Mevlana, öğlen merkez, akşam Alaaddin. Tramvay + yürüyüş süreleriyle favori 1 günlük rotanızı yazın."
  },
  {
    "id": "seed_p_02a",
    "threadId": "seed_th_02",
    "authorId": "mbr_seed_01",
    "createdAt": "2026-07-25T08:42:13.000Z",
    "body": "Hafta içi sakin saatler, müze kartı ve fotoğraf notları. Deneyimlerinizi ekleyin."
  },
  {
    "id": "seed_p_02b",
    "threadId": "seed_th_02",
    "authorId": "mbr_seed_05",
    "createdAt": "2026-07-25T12:00:11.000Z",
    "body": "Teşekkürler, not aldım. Sonucu paylaşırım."
  },
  {
    "id": "seed_p_03a",
    "threadId": "seed_th_03",
    "authorId": "mbr_seed_02",
    "createdAt": "2026-07-25T17:08:26.000Z",
    "body": "Ailece yürünebilecek sakin hat, park ve çay bahçesi önerileri arıyorum."
  },
  {
    "id": "seed_p_03b",
    "threadId": "seed_th_03",
    "authorId": "mbr_seed_07",
    "createdAt": "2026-07-26T07:27:22.000Z",
    "body": "Katılıyorum; ulaşım notu çok işe yarar."
  },
  {
    "id": "seed_p_04a",
    "threadId": "seed_th_04",
    "authorId": "mbr_seed_02",
    "createdAt": "2026-07-26T05:27:39.000Z",
    "body": "Kıtır taban sevenler için adres, porsiyon ve hijyen notu paylaşalım."
  },
  {
    "id": "seed_p_05a",
    "threadId": "seed_th_05",
    "authorId": "mbr_seed_03",
    "createdAt": "2026-07-26T10:55:02.000Z",
    "body": "Giriş, kıyafet, fotoğraf kuralları, çevrede yemek. Eksik madde ekleyin."
  },
  {
    "id": "seed_p_05b",
    "threadId": "seed_th_05",
    "authorId": "mbr_seed_10",
    "createdAt": "2026-07-26T13:16:44.000Z",
    "body": "Ekleme: yanınıza su alın, yazın şart."
  },
  {
    "id": "seed_p_06a",
    "threadId": "seed_th_06",
    "authorId": "mbr_seed_03",
    "createdAt": "2026-07-27T07:03:15.000Z",
    "body": "Medrese, cami, han için mantıklı bir sıra ve kısa kaynak önerisi."
  },
  {
    "id": "seed_p_06b",
    "threadId": "seed_th_06",
    "authorId": "mbr_seed_06",
    "createdAt": "2026-07-27T15:25:05.000Z",
    "body": "Güzel konu, ben de benzer deneyim yaşadım."
  },
  {
    "id": "seed_p_07a",
    "threadId": "seed_th_07",
    "authorId": "mbr_seed_04",
    "createdAt": "2026-07-27T15:41:28.000Z",
    "body": "Hafta sonu kahvaltı + kısa yürüyüş. Erken saat kalabalıktan kaçırır mı?"
  },
  {
    "id": "seed_p_08a",
    "threadId": "seed_th_08",
    "authorId": "mbr_seed_04",
    "createdAt": "2026-07-28T04:52:41.000Z",
    "body": "Sabah ışığı, taş evler. Bilinen kısıtlar varsa yazın."
  },
  {
    "id": "seed_p_08b",
    "threadId": "seed_th_08",
    "authorId": "mbr_seed_09",
    "createdAt": "2026-07-28T16:16:27.000Z",
    "body": "Katılıyorum; ulaşım notu çok işe yarar."
  },
  {
    "id": "seed_p_09a",
    "threadId": "seed_th_09",
    "authorId": "mbr_seed_05",
    "createdAt": "2026-07-28T13:19:04.000Z",
    "body": "Fırın kebabı, bamya çorbası, höşmerim… Kısa lezzet listesi çıkaralım."
  },
  {
    "id": "seed_p_09b",
    "threadId": "seed_th_09",
    "authorId": "mbr_seed_11",
    "createdAt": "2026-07-28T16:44:38.000Z",
    "body": "Sabah erken saatler daha sakin oluyor."
  },
  {
    "id": "seed_p_10a",
    "threadId": "seed_th_10",
    "authorId": "mbr_seed_05",
    "createdAt": "2026-07-29T06:33:17.000Z",
    "body": "Ulaşım kartı, semt, kışa hazırlık, pazar… Listeye ne eklerdiniz?"
  },
  {
    "id": "seed_p_11a",
    "threadId": "seed_th_11",
    "authorId": "mbr_seed_06",
    "createdAt": "2026-07-29T18:06:30.000Z",
    "body": "Alaaddin merkezli en az yürüyüş hangi hatlarla? Abonman deneyimleri."
  },
  {
    "id": "seed_p_11b",
    "threadId": "seed_th_11",
    "authorId": "mbr_seed_09",
    "createdAt": "2026-07-30T03:33:10.000Z",
    "body": "Güzel konu, ben de benzer deneyim yaşadım."
  },
  {
    "id": "seed_p_12a",
    "threadId": "seed_th_12",
    "authorId": "mbr_seed_06",
    "createdAt": "2026-07-30T09:48:43.000Z",
    "body": "Gece gelişinde güvenli ve ekonomik seçenekler neler?"
  },
  {
    "id": "seed_p_12b",
    "threadId": "seed_th_12",
    "authorId": "mbr_seed_10",
    "createdAt": "2026-07-30T12:16:21.000Z",
    "body": "Teşekkürler, not aldım. Sonucu paylaşırım."
  },
  {
    "id": "seed_p_13a",
    "threadId": "seed_th_13",
    "authorId": "mbr_seed_07",
    "createdAt": "2026-07-30T16:22:06.000Z",
    "body": "Tepeden manzara için güvenli noktalar ve tripod notları."
  },
  {
    "id": "seed_p_14a",
    "threadId": "seed_th_14",
    "authorId": "mbr_seed_07",
    "createdAt": "2026-07-31T05:11:19.000Z",
    "body": "Yol, kafe, etkinlik… Kısa haber, kaynak belirterek."
  },
  {
    "id": "seed_p_14b",
    "threadId": "seed_th_14",
    "authorId": "mbr_seed_13",
    "createdAt": "2026-07-31T09:41:43.000Z",
    "body": "Sabah erken saatler daha sakin oluyor."
  },
  {
    "id": "seed_p_15a",
    "threadId": "seed_th_15",
    "authorId": "mbr_seed_08",
    "createdAt": "2026-07-31T11:37:32.000Z",
    "body": "Turistik olmayan eser / mahalle önerileri, kısa bilgiyle."
  },
  {
    "id": "seed_p_15b",
    "threadId": "seed_th_15",
    "authorId": "mbr_seed_15",
    "createdAt": "2026-07-31T18:08:04.000Z",
    "body": "Ekleme: yanınıza su alın, yazın şart."
  },
  {
    "id": "seed_p_16a",
    "threadId": "seed_th_16",
    "authorId": "mbr_seed_08",
    "createdAt": "2026-08-01T07:59:45.000Z",
    "body": "Net başlık, net soru, spam yok. İyi konu şablonunuz var mı?"
  },
  {
    "id": "seed_p_17a",
    "threadId": "seed_th_17",
    "authorId": "mbr_seed_09",
    "createdAt": "2026-08-01T14:04:08.000Z",
    "body": "Bilet, kıyafet, sessizlik. Ailece gidecekler için özet."
  },
  {
    "id": "seed_p_17b",
    "threadId": "seed_th_17",
    "authorId": "mbr_seed_13",
    "createdAt": "2026-08-02T00:37:26.000Z",
    "body": "Teşekkürler, not aldım. Sonucu paylaşırım."
  },
  {
    "id": "seed_p_18a",
    "threadId": "seed_th_18",
    "authorId": "mbr_seed_09",
    "createdAt": "2026-08-02T06:28:21.000Z",
    "body": "Belediye, üniversite, salon hesapları / link önerileri."
  },
  {
    "id": "seed_p_18b",
    "threadId": "seed_th_18",
    "authorId": "mbr_seed_14",
    "createdAt": "2026-08-02T12:02:37.000Z",
    "body": "Katılıyorum; ulaşım notu çok işe yarar."
  },
  {
    "id": "seed_p_19a",
    "threadId": "seed_th_19",
    "authorId": "mbr_seed_10",
    "createdAt": "2026-08-02T19:15:34.000Z",
    "body": "Ücretsiz veya uygun bütçeli etkinlik ve kulüp duyuruları."
  },
  {
    "id": "seed_p_20a",
    "threadId": "seed_th_20",
    "authorId": "mbr_seed_10",
    "createdAt": "2026-08-03T08:07:47.000Z",
    "body": "Kayıt, profil, konu açma, ikinci el kuralları. Kısa kılavuz."
  },
  {
    "id": "seed_p_20b",
    "threadId": "seed_th_20",
    "authorId": "mbr_seed_02",
    "createdAt": "2026-08-03T10:43:09.000Z",
    "body": "Ekleme: yanınıza su alın, yazın şart."
  },
  {
    "id": "seed_p_21a",
    "threadId": "seed_th_21",
    "authorId": "mbr_seed_11",
    "createdAt": "2026-08-03T12:44:10.000Z",
    "body": "CV, sektörler, semt. İş panosunu kullanmayı unutmayın."
  },
  {
    "id": "seed_p_21b",
    "threadId": "seed_th_21",
    "authorId": "mbr_seed_14",
    "createdAt": "2026-08-04T01:21:20.000Z",
    "body": "Güzel konu, ben de benzer deneyim yaşadım."
  },
  {
    "id": "seed_p_22a",
    "threadId": "seed_th_22",
    "authorId": "mbr_seed_11",
    "createdAt": "2026-08-04T05:51:23.000Z",
    "body": "Sıcak günde iç mekân + serin akşam planı. En çok önerilen 10 madde."
  },
  {
    "id": "seed_p_23a",
    "threadId": "seed_th_23",
    "authorId": "mbr_seed_12",
    "createdAt": "2026-08-04T16:13:36.000Z",
    "body": "Aydınlık, kalabalık, ulaşılır noktalar. Anlaşma site dışında."
  },
  {
    "id": "seed_p_23b",
    "threadId": "seed_th_23",
    "authorId": "mbr_seed_02",
    "createdAt": "2026-08-04T19:52:42.000Z",
    "body": "Katılıyorum; ulaşım notu çok işe yarar."
  },
  {
    "id": "seed_p_24a",
    "threadId": "seed_th_24",
    "authorId": "mbr_seed_12",
    "createdAt": "2026-08-05T07:26:49.000Z",
    "body": "Başlık, foto, fiyat, semt, iletişim. Yasaklı içerik yok."
  },
  {
    "id": "seed_p_24b",
    "threadId": "seed_th_24",
    "authorId": "mbr_seed_03",
    "createdAt": "2026-08-05T14:43:03.000Z",
    "body": "Sabah erken saatler daha sakin oluyor."
  },
  {
    "id": "seed_p_25a",
    "threadId": "seed_th_25",
    "authorId": "mbr_seed_13",
    "createdAt": "2026-08-05T10:09:12.000Z",
    "body": "Müze + park + yemek. Bebek arabası dostu güzergâh?"
  },
  {
    "id": "seed_p_26a",
    "threadId": "seed_th_26",
    "authorId": "mbr_seed_13",
    "createdAt": "2026-08-06T06:18:25.000Z",
    "body": "1–1,5 saat mesafede sakin doğa noktaları ve yol notu."
  },
  {
    "id": "seed_p_26b",
    "threadId": "seed_th_26",
    "authorId": "mbr_seed_01",
    "createdAt": "2026-08-06T15:37:25.000Z",
    "body": "Güzel konu, ben de benzer deneyim yaşadım."
  },
  {
    "id": "seed_p_27a",
    "threadId": "seed_th_27",
    "authorId": "mbr_seed_14",
    "createdAt": "2026-08-06T13:52:38.000Z",
    "body": "Aydınlatma, kalabalık cadde, otopark notları."
  },
  {
    "id": "seed_p_27b",
    "threadId": "seed_th_27",
    "authorId": "mbr_seed_03",
    "createdAt": "2026-08-06T16:12:36.000Z",
    "body": "Teşekkürler, not aldım. Sonucu paylaşırım."
  },
  {
    "id": "seed_p_28a",
    "threadId": "seed_th_28",
    "authorId": "mbr_seed_14",
    "createdAt": "2026-08-07T08:34:01.000Z",
    "body": "Gece açık, temiz mekân önerileri."
  },
  {
    "id": "seed_p_29a",
    "threadId": "seed_th_29",
    "authorId": "mbr_seed_15",
    "createdAt": "2026-08-07T17:47:14.000Z",
    "body": "İş/okul, kira, market, ulaşım kriterleri."
  },
  {
    "id": "seed_p_29b",
    "threadId": "seed_th_29",
    "authorId": "mbr_seed_06",
    "createdAt": "2026-08-07T22:09:08.000Z",
    "body": "Sabah erken saatler daha sakin oluyor."
  },
  {
    "id": "seed_p_30a",
    "threadId": "seed_th_30",
    "authorId": "mbr_seed_15",
    "createdAt": "2026-08-08T05:05:27.000Z",
    "body": "Tanışma, bir konu, bir cevap, profil. Forumu birlikte ısıtalım."
  },
  {
    "id": "seed_p_30b",
    "threadId": "seed_th_30",
    "authorId": "mbr_seed_07",
    "createdAt": "2026-08-08T16:28:19.000Z",
    "body": "Ekleme: yanınıza su alın, yazın şart."
  }
] as Post[];

export function mergeCommunityMembers(existing: Member[]): Member[] {
  const byId = new Map(existing.map((m) => [m.id, m]));
  for (const m of COMMUNITY_MEMBERS) {
    const prev = byId.get(m.id);
    if (!prev) {
      byId.set(m.id, m);
      continue;
    }
    // Seed kayıtlarını güncel isim/profil ile tazele (v2 gerçekçi isimler)
    if (m.id.startsWith("mbr_seed_")) {
      byId.set(m.id, {
        ...prev,
        displayName: m.displayName,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        lastLoginAt: m.lastLoginAt,
        profile: { ...prev.profile, ...m.profile },
        passwordHash: m.passwordHash,
        activity: m.activity ?? prev.activity,
      });
    }
  }
  return [...byId.values()];
}

export function mergeCommunityForum(input: {
  threads: Thread[];
  posts: Post[];
  names: Record<string, string>;
}): { threads: Thread[]; posts: Post[]; names: Record<string, string> } {
  const tMap = new Map(input.threads.map((t) => [t.id, t]));
  for (const t of COMMUNITY_THREADS) {
    const prev = tMap.get(t.id);
    if (!prev) {
      tMap.set(t.id, t);
      continue;
    }
    // seed konular: zaman damgalarını güncel seed ile hizala
    if (t.id.startsWith("seed_th_")) {
      tMap.set(t.id, {
        ...prev,
        createdAt: t.createdAt,
        lastPostAt: t.lastPostAt,
        views: Math.max(prev.views ?? 0, t.views ?? 0),
        replies: Math.max(prev.replies ?? 0, t.replies ?? 0),
        lastPosterId: t.lastPosterId,
      });
    }
  }
  const pMap = new Map(input.posts.map((p) => [p.id, p]));
  for (const p of COMMUNITY_POSTS) {
    const prev = pMap.get(p.id);
    if (!prev) {
      pMap.set(p.id, p);
      continue;
    }
    if (p.id.startsWith("seed_p_")) {
      pMap.set(p.id, { ...prev, createdAt: p.createdAt });
    }
  }
  const names = { ...input.names, ...COMMUNITY_NAMES };
  // seed id'ler her zaman güncel isim
  for (const [id, name] of Object.entries(COMMUNITY_NAMES)) {
    names[id] = name;
  }
  return {
    threads: [...tMap.values()],
    posts: [...pMap.values()],
    names,
  };
}
