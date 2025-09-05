import { CitySearch } from "@/components/CitySearch";
import heroImage from "@/assets/city-finder-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
        <div className="relative container mx-auto px-4 pt-12 pb-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="Global city finder illustration showing world map with location pins"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Find Any City's Country
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get normalized city names and country information instantly using Google Maps data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 pb-16">
        <CitySearch />
      </div>
    </div>
  );
};

export default Index;
