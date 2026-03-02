import type { ReactNode } from "react";

export default function MainLayout({children} : {children: ReactNode}){





    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            {children}
        </div>
    )
}