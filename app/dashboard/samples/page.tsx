export default function SamplesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Sample Requests</h1>
          <p className="text-neutral-500 mt-2">Track sample development and shipping.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
          + New Sample Request
        </button>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm p-12 text-center text-neutral-500">
        <p>No active sample requests found.</p>
        <p className="text-sm mt-2">Connect the database to see real data.</p>
      </div>
    </div>
  );
}
