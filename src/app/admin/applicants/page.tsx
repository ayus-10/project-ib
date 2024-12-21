"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { ACCESS_TOKEN } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage } from "@/redux/slices/alertSlice";
import refreshTokens from "@/requests/refreshTokens";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Application {
  id: number;
  coverLetter: string;
  applicant: {
    email: string;
    fullName: string;
  };
}

interface GetApplications {
  applications: Application[];
}

interface CoverLetterState {
  show: boolean | undefined;
  id: number | undefined;
}

const initialState: CoverLetterState = { id: undefined, show: undefined };

export default function Applicants() {
  const [applications, setApplications] = useState<Application[]>([]);

  const [loading, setLoading] = useState(true);

  const [jobId, setJobId] = useState("");

  const dispatch = useAppDispatch();

  const [coverLetterInfo, setCoverLetterInfo] =
    useState<CoverLetterState>(initialState);

  const jobIdInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const sendRequest = () =>
      axios.get<GetApplications>("/api/application?jobId=" + jobId, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });

    async function getApplications() {
      try {
        const res = await sendRequest();
        handleApplications(res.data.applications);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          try {
            await refreshTokens();
            const newRes = await sendRequest();
            handleApplications(newRes.data.applications);
          } catch (newError) {
            router.push("/admin");
            console.log("Unable to load applications: ", newError);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    if (jobId) getApplications();
  }, [jobId, router]);

  function handleApplications(apps: Application[]) {
    if (apps.length === 0) {
      dispatch(setErrorMessage("No applicants found for this job."));
      router.push("/admin");
    } else {
      setApplications(apps);
    }
  }

  function updateJobId() {
    if (!jobIdInputRef.current || !jobIdInputRef.current.value) return;
    setJobId(jobIdInputRef.current.value);
  }

  function showCoverLetterModal(id: number) {
    setCoverLetterInfo({ id, show: true });
  }

  function hideCoverLetterModal() {
    setCoverLetterInfo(initialState);
  }

  if (!jobId)
    return (
      <dialog className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">View applicants</h3>
          <input
            ref={jobIdInputRef}
            type="text"
            placeholder="Enter job ID to continue..."
            className="input input-bordered w-full max-w-xs"
          />
          <div className="modal-action">
            <button className="btn btn-primary" onClick={updateJobId}>
              Ok
            </button>
            <button className="btn" onClick={() => router.push("/admin")}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    );

  if (jobId && !loading)
    return (
      <div className="w-full h-full py-4">
        <div className="overflow-x-auto">
          <table className="table table-zebra md:table-fixed">
            <thead>
              <tr>
                <th>SN</th>
                <th>Applicant Email</th>
                <th>Applicant Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <tr key={app.id}>
                  <th>{i + 1}</th>
                  <td>{app.applicant.email}</td>
                  <td>{app.applicant.fullName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => showCoverLetterModal(app.id)}
                    >
                      Cover letter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CoverLetterModal
          coverLetter={coverLetterInfo}
          hideModal={hideCoverLetterModal}
          applications={applications}
        />
      </div>
    );

  return <LoadingSpinner />;
}

interface CoverLetterModalProps {
  coverLetter: CoverLetterState;
  hideModal: () => void;
  applications: Application[];
}

function CoverLetterModal(props: CoverLetterModalProps) {
  const { coverLetter, hideModal, applications } = props;
  const application = applications.find((app) => app.id === coverLetter.id);

  if (application)
    return (
      <dialog className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {application.applicant.fullName}&apos;s cover letter
          </h3>
          <p>{application.coverLetter}</p>
          <div className="modal-action">
            <button className="btn" onClick={hideModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    );
}
