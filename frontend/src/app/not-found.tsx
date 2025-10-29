import Image from "next/image";
import Bird from "../../public/not-found.png";

export default function NotFound() {
  return (
    <div>
      <Image src={Bird} alt="чайка" />
    </div>
  );
}
