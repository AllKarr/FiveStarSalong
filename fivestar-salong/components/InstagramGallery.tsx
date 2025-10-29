import Image from "next/image";

/**
 * InstagramGallery
 * Instagram gallery with one video on each side (same height, no react-icons).
 */
export default function InstagramGallery() {
  const instagramLink = "https://www.instagram.com/fivestarsalong"; // update with your link
  const images = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <section className="bg-[#f7f7f7] text-center py-12">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Follow us on Instagram
      </h2>
      <p className="text-sm text-gray-600 mb-8">
        For the latest deals and extensions
      </p>

      {/* Container with videos on sides and images in center */}
      <div className="flex justify-center items-stretch gap-2 max-w-[1600px] mx-auto px-2">
        {/* LEFT VIDEO */}
        <div className="relative hidden lg:block overflow-hidden rounded-lg w-1/5">
          <video
            src="/videos/left.mov"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-[700px]"
          />
        </div>

        {/* CENTER GRID (8 IMAGES) */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[700px] w-full md:w-3/5"
          style={{ gridAutoRows: "1fr" }}
        >
          {images.map((id) => (
            <div key={id} className="relative group overflow-hidden rounded-lg">
              <Image
                src={`/images/insta${id}.jpg`}
                alt={`Instagram post ${id}`}
                width={800}
                height={800}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                {/* Inline SVG Instagram icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  className="w-10 h-10 mb-2"
                >
                  <path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5c3.072 0 5.75-2.678 5.75-5.75v-8.5C22 4.678 19.322 2 16.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 1.5A3.5 3.5 0 1 1 12 15a3.5 3.5 0 0 1 0-7zm5.25-.875a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0z" />
                </svg>

                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-sm hover:text-gray-200"
                >
                  @{instagramLink.split("/").pop()}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT VIDEO */}
        <div className="relative hidden lg:block overflow-hidden rounded-lg w-1/5">
          <video
            src="/videos/right.mov"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-[700px]"
          />
        </div>
      </div>
    </section>
  );
}
