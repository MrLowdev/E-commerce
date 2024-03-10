import Link from "next/link";

const NotFound = () => {
  return (
    <section className="bg-white h-screen w-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-slate-600 ">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-slate-900 md:text-4xl ">
            Something missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 ">
            Sorry, we can not find that page. You will find lots to explore on
            the home page.
          </p>
          <Link
            href="/"
            className="inline-flex text-white bg-slate-600 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
