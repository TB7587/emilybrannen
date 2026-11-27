import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl">That page isn't on the menu</h1>
      <p className="mt-3 text-ink-soft">It may have moved. Let's get you back to the good stuff.</p>
      <Link href="/" className="btn btn-primary mt-6">Back to home</Link>
    </div>
  );
}
