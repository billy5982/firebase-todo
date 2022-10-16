import { signOut } from "firebase/auth";
import MainPanel from "./MainPanel/MainPanel";
import SidePanel from "./SidePanel/SidePanel";

function Home() {
  return (
    <div className="flex w-full h-full">
      <div className="w-1/4 h-[100%] p-2 bg-white rounded-tl-[60px] rounded-bl-[60px]">
        <SidePanel />
      </div>
      <div className="w-3/4 h-full p-2">
        <MainPanel />
      </div>
    </div>
  );
}

export default Home;
