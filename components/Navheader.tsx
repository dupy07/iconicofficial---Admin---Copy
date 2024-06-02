import Link from "next/link";

const Navheader = () => {
  return (
    <>
      <header className="hidden md:block bg-slate-200 p-2">
        <div className="container flexBetween">
          <div className="">
            <span className="fs-300 fw-regular">
              Free shipping, 30-day return or refund guarantee.
            </span>
          </div>
          <div className="fs-300 flex items-center gap-6">
            <Link href="/signin" className="">
              Sign In
            </Link>
            <Link href="/faqs" className="">
              Help
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
export default Navheader;
