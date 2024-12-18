export default function LoadingSpinner() {
  return (
    <div className="h-[calc(100vh-4rem)] grid place-content-center">
      <span className="loading loading-ring w-40 -mt-16"></span>
    </div>
  );
}
