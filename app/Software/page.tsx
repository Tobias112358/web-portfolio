import Navbar from "../navbar"
import SoftwareDisplay from "./softwareDisplay"

export default function Software() {
    

    return(
        <main className="flex font-bold font-mono flex-wrap gap-4 justify-center">
            <Navbar />
            <div className="m-3 p-1 bg-slate-900 text-center rounded-lg">
                <div className="m-3 text-xl">
                    Software
                </div>
                <div>
                    <p>
                        Here is a bunch of software I have made in my free time. Links to download, view source code and possibly interact with it.
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center items-center m-3 p-1 bg-slate-900 text-center w-full rounded-lg">
                <SoftwareDisplay />
            </div>    
        </main>
    )
}