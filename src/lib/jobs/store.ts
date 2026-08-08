import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SEED_JOBS,
  type JobKind,
  type JobListing,
  type JobType,
} from "./data";

type JobsState = {
  jobs: JobListing[];
  addJob: (input: {
    type: JobType;
    title: string;
    companyOrPerson: string;
    kind: JobKind;
    district: string;
    description: string;
    contact: string;
    salaryNote: string;
    authorName: string;
  }) => string;
  closeJob: (id: string) => void;
};

function id() {
  return `j_${Math.random().toString(36).slice(2, 10)}`;
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: SEED_JOBS,
      addJob: (input) => {
        const jobId = id();
        const job: JobListing = {
          id: jobId,
          type: input.type,
          title: input.title.trim(),
          companyOrPerson: input.companyOrPerson.trim(),
          kind: input.kind,
          district: input.district,
          description: input.description.trim(),
          contact: input.contact.trim(),
          salaryNote: input.salaryNote.trim(),
          authorName: input.authorName.trim() || "Misafir",
          createdAt: new Date().toISOString(),
          status: "aktif",
        };
        set({ jobs: [job, ...get().jobs] });
        return jobId;
      },
      closeJob: (jobId) => {
        set({
          jobs: get().jobs.map((j) =>
            j.id === jobId ? { ...j, status: "kapandi" } : j,
          ),
        });
      },
    }),
    { name: "konyago-arsiv-jobs-v1" },
  ),
);
