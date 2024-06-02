const Header = () => {
  return (
    <>
      <div className="text-center py-3 fw-semi-bold">
        <span className="">Welcome to Iconic Offcial Admin Page</span>
      </div>
      <div className="rounded-tr-md rounded-br-md border border-gray-300 bg-white flex relative h-20 p-5 text-gray-700">
        <div className="flex items-center p-4 gap-6">
          <img src="/profile-1.png" alt="Logo" className="w-12 h-12" />
          <h2 className="text-3xl font-bold">
            ICO<span className="text-red-500">NIC</span>
          </h2>
        </div>
      </div>
    </>
  );
};

export default Header;
