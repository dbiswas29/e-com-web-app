import Link from 'next/link';

const categories = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    href: '/products?category=Electronics',
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    href: '/products?category=Fashion',
  },
  {
    name: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    href: '/products?category=Home%20%26%20Garden',
  },
  {
    name: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    href: '/products?category=Sports%20%26%20Fitness',
  },
];

export function Categories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow"
        >
          <div className="aspect-square relative">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-xl font-bold text-white text-center">
                {category.name}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
