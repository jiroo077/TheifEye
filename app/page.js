import Image from "next/image";
import ObjectDetection from "@/components/object_detection";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-extrabold text-2xl md:text-4xl lg:text-6xl tracking-tight md:px-6 text-center leading-tight animate-gradient">
       ThiefEye
      </h1>
    <ObjectDetection/>
    </main>
  );
}