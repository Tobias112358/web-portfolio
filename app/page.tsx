import Navbar from "./navbar"
import MainButton from "./mainButton"
import { ThreeBackground } from "./threeBackground"

export default async function Home() {
  var intro_text = "This is the homepage of Toby Loveridge's web portfolio. On here, you can find my work experience, my downloadable projects and github repositories, and music projects. Hopefully it's very cool but I dunno...";
  


  return (
    <main className="flex font-bold font-mono justify-normal flex-wrap gap-4">
      <Navbar />
      <div className="w-screen h-dvh">
        <ThreeBackground text={intro_text} />
      </div>
      {/*<div className="flex flex-wrap justify-center items-center m-3 p-1 bg-slate-900 text-center w-full rounded-lg">
        <MainButton link={"https://github.com/Tobias112358"} name={"Github"} />
        <MainButton link={"https://github.com/Tobias112358"} name={"LinkedIn"} />
        <MainButton link={"https://github.com/Tobias112358"} name={"X"} />
  </div>*/}
    </main>
  )
}
