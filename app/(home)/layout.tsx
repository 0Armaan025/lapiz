import CustomCursor from "../components/CustomCursor"
const Layout = ({ children }: { children: React.ReactNode }) => {

  return (

    <div className="min-h-screen bg-[#0a0a0a]">

      <CustomCursor />
      {children}
    </div>
  );
}

export default Layout;
