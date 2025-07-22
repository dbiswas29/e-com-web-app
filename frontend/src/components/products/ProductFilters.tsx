export function ProductFilters() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Electronics
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Fashion
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Home & Garden
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Sports & Fitness
          </label>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Min Price</label>
            <input type="number" className="input" placeholder="$0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Price</label>
            <input type="number" className="input" placeholder="$1000" />
          </div>
          <button className="btn-primary w-full">Apply</button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Rating</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="rating" className="mr-2" />
            4 stars & up
          </label>
          <label className="flex items-center">
            <input type="radio" name="rating" className="mr-2" />
            3 stars & up
          </label>
          <label className="flex items-center">
            <input type="radio" name="rating" className="mr-2" />
            2 stars & up
          </label>
        </div>
      </div>
    </div>
  );
}
