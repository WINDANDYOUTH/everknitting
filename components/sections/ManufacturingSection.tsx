import Image from "next/image";

type ManufacturingSectionProps = {
  title: string;
  description: string;
  images: string[];
};

export default function ManufacturingSection({
  title,
  description,
  images,
}: ManufacturingSectionProps) {
  return (
    <section className="py-16 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* 文案 */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            {title}
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 图片（可横向滑动） */}
        <div className="overflow-x-auto">
          <div className="flex gap-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="relative min-w-[260px] h-[200px] md:min-w-[300px] md:h-[220px] rounded-xl overflow-hidden bg-neutral-100"
              >
                <Image
                  src={src}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
