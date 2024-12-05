import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import Loader from "./Loader";

const QUERY = gql`
  query {
    restaurants {
      documentId
      name
      description
      image {
        url
      }
    }
  }
`;

function RestaurantCard({ data }) {
  // description이 배열형태이므로 텍스트로 변환
  const getDescription = (desc) => {
    if (!desc || !Array.isArray(desc)) return "";
    return desc
      .map((item) => {
        if (item.type === "paragraph") {
          return item.children.map((child) => child.text).join("");
        }
        return "";
      })
      .join("\n");
  };

  // 이미지도 배열이므로 첫 번째 이미지 사용
  const getImageUrl = () => {
    if (!data.image || !Array.isArray(data.image) || data.image.length === 0) {
      return null;
    }
    const imageUrl = data.image[0].url;
    return `${
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8082"
    }${imageUrl}`;
  };

  const imageUrl =
    getImageUrl() ||
    `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`;

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="h-full bg-gray-100 rounded-2xl">
        <div className="relative w-full h-48">
          <Image
            className="rounded-t-2xl object-cover"
            src={imageUrl}
            alt={data.name || "Restaurant image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="p-8">
          <h3 className="mb-3 font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
            {data.name}
          </h3>
          <p className="text-sm text-gray-500 font-bold">
            {getDescription(data.description)}
          </p>
          <div className="flex flex-wrap md:justify-center -m-2">
            <div className="w-full md:w-auto p-2 my-6">
              <Link
                className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                href={`/restaurant/${data.documentId}`}
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RestaurantList({ query = "" }) {
  const { loading, error, data } = useQuery(QUERY);

  console.log("GraphQL Response:", { loading, error, data });

  if (error) return <div>Error loading restaurants: {error.message}</div>;
  if (loading) return <Loader />;

  if (!data?.restaurants || !data.restaurants.length) {
    return <div>No restaurants available</div>;
  }

  const filteredRestaurants = data.restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredRestaurants.length > 0) {
    return (
      <div className="py-16 px-8 bg-white rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap -m-4 mb-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.documentId} data={restaurant} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return data.restaurants.length > 0 ? (
    <div className="text-xl">No Restaurants Found</div>
  ) : (
    <div className="text-xl">Add Restaurants</div>
  );
}

export default RestaurantList;
