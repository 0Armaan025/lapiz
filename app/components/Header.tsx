import { Quicksand } from "next/font/google";

const raleWayFont = Quicksand({
  subsets: ["latin"],
  weight: ["500"]

});
const Header = () => {
  return (
    <div className="header w-full h-38   cursor-default border-b-1 border-b-zinc-700 flex flex-col justify-start items-start p-6">

      <h2 className={`text-4xl font-semibold text-white ${raleWayFont.className}`}><span className=" mr-1 text-white/90 text-3xl">@</span>0Armaan025</h2 >
      <h4 className={`text-2xl w-full font-medium mt-4 text-gray-300 ${raleWayFont.className}`}>&quot;This is the bio&quot;</h4>

    </div >
  );
}


export default Header;
