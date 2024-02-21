export default function Navbar() {
    return(
        <div className="flex w-full bg-lime-900 h-fit absolute">
            <nav>
                <ul className="flex flex-wrap space-x-8">
                    <li><a className="hover:text-cyan-300" href="/">Home</a></li>
                    <li><a className="hover:text-cyan-300" href="Music">Music</a></li>
                    <li><a className="hover:text-cyan-300" href="Software">Software</a></li>
                    <li><a className="hover:text-cyan-300" href="WorkExperience">Work Experience</a></li>
                    <li><a className="hover:text-cyan-300" href="Contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    )
}