import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white py-8">
      <div className="container mx-auto px-4">
        <Image
          src="/placeholder.svg?height=30&width=50"
          alt="Logo"
          width={50}
          height={30}
          className="h-auto w-auto"
        />
      </div>
    </footer>
  );
} 