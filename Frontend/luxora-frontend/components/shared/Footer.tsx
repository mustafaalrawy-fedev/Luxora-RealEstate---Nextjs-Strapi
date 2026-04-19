import Link from "next/link";
import Logo from "./Logo";
import { NavigationLinks } from "../ui/navigation-links";


const Footer = () => {
  return (
    <footer className="">
      <div className="container-space py-20 h-fit bg-card flex justify-between items-start w-full flex-wrap gap-10 border-t border-border">
        <Logo />
        <div className="flex justify-between items-start gap-20 w-fit flex-wrap">
            <div className="flex justify-start items-start flex-col gap-2">
                <h6 className="font-bold text-lg text-muted-foreground">Quick Links</h6>
                <NavigationLinks className="flex-col w-fit items-start"/>
            </div>
            <div className="flex justify-start items-start flex-col gap-2 w-max">
                <h6 className="font-bold text-lg text-muted-foreground">Contact</h6>
                <ul className="flex flex-col gap-2">
                    <li><Link href="mailto:mustafaalrawy@gmail.com">electus1@gmail.com</Link></li>
                    <li><Link href="tel:+201030037976">+20 103 003 7976</Link></li>
                </ul>
            </div>
            <div className="flex justify-start items-start flex-col gap-2 w-max">
                <h6 className="font-bold text-lg text-muted-foreground">Social Media</h6>
                <ul className="flex flex-col gap-2">
                    <li><Link href="mailto:mustafaalrawy@gmail.com">Facebook</Link></li>
                    <li><Link href="tel:+201030037976">Instagram</Link></li>
                    <li><Link href="tel:+201030037976">X</Link></li>
                    <li><Link href="tel:+201030037976">Linkedin</Link></li>
                    <li><Link href="tel:+201030037976">Contra</Link></li>
                    <li><Link href="tel:+201030037976">Dribble</Link></li>
                </ul>
            </div>
        </div>
      </div>
      {/* <div className="divider"></div> */}
      <div className="flex flex-col-reverse md:flex-row justify-between  w-full container-space py-2 h-fit bg-card border-t border-border">
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Luxora. All rights reserved.</p>
        <p className="text-muted-foreground text-sm">Designed by <Link href="https://elrawyportfolio.netlify.app" target="_blank" className="text-primary hover:underline hover:text-primary transition-colors">Mustafa Alrawy</Link></p>
      </div>
    </footer>
  )
}

export default Footer