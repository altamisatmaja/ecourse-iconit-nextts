import { Menu } from "lucide-react";
import SideBar from "./sidebar";

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";

export const MobileSideBar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu/>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                <SideBar/>
            </SheetContent>
        </Sheet>
    )
}