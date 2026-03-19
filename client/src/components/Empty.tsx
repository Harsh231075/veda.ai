import Image from "next/image";

interface EmptyProps {
    title?: string;
    description?: string;
    imageSrc?: string;
}

const Empty = ({
    title = "No items yet",
    description = "There are no items to display here right now.",
    imageSrc = "/undraw_no-data_ig65.svg"
}: EmptyProps) => {
    return (
        <div className="flex items-center justify-center min-h-[60vh] bg-transparent px-4 py-10">
            <div className="text-center w-full max-w-md">

                {/* Illustration */}
                <Image
                    src={imageSrc}
                    alt={title}
                    width={384}
                    height={384}
                    sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
                    className="mx-auto mb-6 h-auto w-72 sm:w-80 lg:w-96 opacity-90"
                />

                {/* Heading */}
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    {description}
                </p>

            </div>
        </div>
    );
};

export default Empty;