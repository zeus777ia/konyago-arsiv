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

/** Yeni site — boş. */
export const SEED_JOBS: JobListing[] = [];

export const JOBS_NOTICE =
  "İş ilanları bilgilendirme panosudur. Sitede maaş ödemesi, başvuru ücreti veya aracılık komisyonu yoktur. İşveren ve aday iletişime geçer; iş görüşmesi site dışında yapılır.";
