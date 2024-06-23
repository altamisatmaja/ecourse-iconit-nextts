import SideBar from "./_components/sidebar";

const DashboarLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-56 flex-col inset-y-0 z-50">
                <SideBar/>
            </div>
            { children }
        </div>
     );
}
 
export default DashboarLayout;