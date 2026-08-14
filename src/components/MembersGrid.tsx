import ProfileCard from "./ui/profile-card";
import { Member } from "../types"; // I need to assume the type is imported or available

export default function MembersGrid({ members }: { members: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((m) => (
        <ProfileCard
          key={m.id}
          name={m.name}
          role={m.role}
          email={m.email}
          avatarSrc={m.photo || "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTExL3NyLWltYWdlLTA1MTEyNS1ubi0xNi1zLTY0MF8xLmpwZw.jpg"}
          className="w-full"
        />
      ))}
    </div>
  );
}
