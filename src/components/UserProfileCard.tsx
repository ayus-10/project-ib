interface UserProfileCardProps {
  email: string;
  fullName: string;
}

export default function UserProfileCard({
  email,
  fullName,
}: UserProfileCardProps) {
  return (
    <div className="card bg-base-100 w-48 h-fit shadow-xl">
      <div className="card-body">
        <div className="avatar placeholder">
          <div className="bg-base-300 text-base-400 w-16 mx-auto rounded-full">
            <span className="text-3xl">{fullName.charAt(0)}</span>
          </div>
        </div>
        <p className="font-semibold">{fullName}</p>
        <p className="font-semibold">{email}</p>
        <button className="btn btn-sm btn-primary">Log out</button>
      </div>
    </div>
  );
}
