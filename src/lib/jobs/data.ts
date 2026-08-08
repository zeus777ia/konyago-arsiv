export type JobType = "isveren" | "is-arayan";
export type JobKind =
  | "tam-zamanli"
  | "yari-zamanli"
  | "staj"
  | "gunluk"
  | "uzaktan"
  | "diger";

export type JobListing = {
  id: string;
  type: JobType;
  title: string;
  companyOrPerson: string;
  kind: JobKind;
  district: string;
  description: string;
  contact: string;
  salaryNote: string;
  authorName: string;
  createdAt: string;
  status: "aktif" | "kapandi";
};

export const JOB_KINDS: { id: JobKind; label: string }[] = [
  { id: "tam-zamanli", label: "Tam zamanlı" },
  { id: "yari-zamanli", label: "Yarı zamanlı" },
  { id: "staj", label: "Staj" },
  { id: "gunluk", label: "Günlük / sezonsal" },
  { id: "uzaktan", label: "Uzaktan" },
  { id: "diger", label: "Diğer" },
];

export const JOB_DISTRICTS = [
  "Selçuklu",
  "Meram",
  "Karatay",
  "Konya geneli",
  "Uzaktan / hibrit",
];

const now = Date.now();
const hours = (h: number) => new Date(now - h * 3600_000).toISOString();
const days = (d: number) => hours(d * 24);

export const SEED_JOBS: JobListing[] = [
  {
    id: "j1",
    type: "isveren",
    title: "Kafe barista / garson aranıyor",
    companyOrPerson: "Meram merkez kafe",
    kind: "tam-zamanli",
    district: "Meram",
    description:
      "Deneyimli veya öğrenmeye açık. Vardiyalı çalışma. CV ve iletişim site üzerinden paylaşılır; görüşme yüz yüze.",
    contact: "is@ornek.kafe (örnek)",
    salaryNote: "Asgari + prim (görüşülür)",
    authorName: "MevlanaSever",
    createdAt: hours(8),
    status: "aktif",
  },
  {
    id: "j2",
    type: "isveren",
    title: "Muhasebe stajyeri",
    companyOrPerson: "Yerel mali müşavirlik",
    kind: "staj",
    district: "Selçuklu",
    description:
      "Öğrenci veya yeni mezun. Excel bilgisi tercih. Sitede ücret ödemesi yok; başvuru iletişimi ile yapılır.",
    contact: "ik@ornek.ofis",
    salaryNote: "Staj ücreti görüşülür",
    authorName: "SelcukluTarih",
    createdAt: days(1),
    status: "aktif",
  },
  {
    id: "j3",
    type: "is-arayan",
    title: "Grafik tasarım / sosyal medya işi arıyorum",
    companyOrPerson: "Bireysel",
    kind: "yari-zamanli",
    district: "Konya geneli",
    description:
      "2 yıl freelance deneyim. Canva + temel Adobe. Uzaktan veya ofis. Portföy talep üzerine.",
    contact: "tasarim@ornek.mail",
    salaryNote: "Proje / aylık görüşülür",
    authorName: "FotoKonya",
    createdAt: days(2),
    status: "aktif",
  },
  {
    id: "j4",
    type: "is-arayan",
    title: "Depo / kargo elemanı olarak çalışabilirim",
    companyOrPerson: "Bireysel",
    kind: "gunluk",
    district: "Karatay",
    description:
      "Ehliyet yok. Fiziksel işe uygum. Hafta içi müsait. İşverenler sitede buluşup iletişime geçsin.",
    contact: "WhatsApp talep üzerine",
    salaryNote: "Günlük yevmiye",
    authorName: "YeniUye42",
    createdAt: hours(14),
    status: "aktif",
  },
];

export const JOBS_NOTICE =
  "İş ilanları bilgilendirme panosudur. Sitede maaş ödemesi, başvuru ücreti veya aracılık komisyonu yoktur. İşveren ve aday iletişime geçer; iş görüşmesi site dışında yapılır.";
