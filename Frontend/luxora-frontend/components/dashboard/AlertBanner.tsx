"use client"

import { useProfile } from "@/hooks/use-profile"
import Link from "next/link"


const AlertBanner = () => {
    const {data: profile} = useProfile();

    const phoneCompleted = profile?.phone;
    const avatarCompleted = profile?.avatar;
    // const socialLinksCompleted = profile?.socialLinks;
    const isProfileCompleted = phoneCompleted && avatarCompleted;

    if(!isProfileCompleted) {
        return (
            <div className="bg-warning/10 border border-warning rounded-lg p-4">
                <div className="flex items-center justify-start gap-2">
                    <p className="text-warning">Please complete your profile to continue</p>
                    <Link href="/settings" className="text-warning underline">Complete Profile</Link>
                </div>
                {!phoneCompleted && (
                    <p className="text-warning">Phone is required</p>
                )}
                {!avatarCompleted && (
                    <p className="text-warning">Avatar is required</p>
                )}
            </div>
        )
    }
  return null;
}

export default AlertBanner