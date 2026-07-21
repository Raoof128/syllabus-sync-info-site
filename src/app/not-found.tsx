import Link from "next/link";

export default function NotFound() {
  return <main className="not-found" id="main-content"><div><span>404</span><h1>That page is out of the plan.</h1><p>The link may be old, or the page may have moved.</p><Link className="button" href="/">Return home</Link></div></main>;
}
