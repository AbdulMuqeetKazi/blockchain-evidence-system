import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { BlockchainBackground } from "../BlockchainBackground";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0B0F19] dark relative">
      <BlockchainBackground />
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
