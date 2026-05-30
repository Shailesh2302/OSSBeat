export default function DashboardRoot() {
  return (
    <div className="flex items-center justify-center h-full p-12">
      <div className="text-center max-w-lg">
        <h1 className="newspaper-headline text-3xl">Welcome to the OSSBeat Dashboard</h1>
        <hr className="newspaper-rule-thin my-6" />
        <p className="newspaper-body text-muted-foreground">
          Select a section from the sidebar to explore repositories, browse open
          issues, or find GSoC and Hacktoberfest projects.
        </p>
      </div>
    </div>
  );
}
