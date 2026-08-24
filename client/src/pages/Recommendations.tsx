import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, BookOpen, Music, Film } from "lucide-react";

const movies = [
  { id: 1, title: "Cyberpunk 2077: Edgerunners", genre: "Sci-Fi / Anime", rating: 4.9, match: 98, image: "bg-gradient-to-br from-yellow-400 to-red-600" },
  { id: 2, title: "Dune: Part Two", genre: "Sci-Fi / Drama", rating: 4.8, match: 95, image: "bg-gradient-to-br from-orange-300 to-amber-700" },
  { id: 3, title: "Severance", genre: "Thriller / Sci-Fi", rating: 4.7, match: 92, image: "bg-gradient-to-br from-teal-400 to-blue-600" },
  { id: 4, title: "The Bear", genre: "Drama", rating: 4.8, match: 89, image: "bg-gradient-to-br from-slate-400 to-slate-800" },
  { id: 5, title: "Oppenheimer", genre: "Sci-Fi / Biography", rating: 4.9, match: 94, image: "bg-gradient-to-br from-indigo-600 to-black" },
  { id: 6, title: "Inception", genre: "Sci-Fi / Thriller", rating: 4.8, match: 93, image: "bg-gradient-to-br from-blue-600 to-purple-900" },
  { id: 7, title: "Blade Runner 2049", genre: "Sci-Fi", rating: 4.7, match: 91, image: "bg-gradient-to-br from-cyan-600 to-gray-800" },
  { id: 8, title: "The Matrix Resurrections", genre: "Sci-Fi / Action", rating: 4.6, match: 88, image: "bg-gradient-to-br from-green-600 to-black" },
  { id: 9, title: "Dhurandher", genre: "Indian Drama / Thriller", rating: 4.8, match: 92, image: "bg-gradient-to-br from-amber-700 to-red-900" },
];

const books = [
  { id: 1, title: "Project Hail Mary", author: "Andy Weir", match: 99, image: "bg-gradient-to-br from-blue-400 to-indigo-600" },
  { id: 2, title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", match: 94, image: "bg-gradient-to-br from-pink-400 to-rose-600" },
  { id: 3, title: "Dark Matter", author: "Blake Crouch", match: 91, image: "bg-gradient-to-br from-gray-800 to-black" },
];

const music = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", genre: "Synthwave / Pop", rating: 4.9, match: 96, image: "bg-gradient-to-br from-red-500 to-purple-600" },
  { id: 2, title: "Levitating", artist: "Dua Lipa ft. DaBaby", genre: "Disco / Pop", rating: 4.8, match: 94, image: "bg-gradient-to-br from-cyan-400 to-blue-600" },
  { id: 3, title: "Afterglow", artist: "Ed Sheeran", genre: "Pop / Ballad", rating: 4.7, match: 91, image: "bg-gradient-to-br from-orange-400 to-red-600" },
  { id: 4, title: "Peaches", artist: "Justin Bieber ft. Daniel Caesar", genre: "Pop / R&B", rating: 4.6, match: 88, image: "bg-gradient-to-br from-yellow-400 to-orange-500" },
  { id: 5, title: "Anti-Hero", artist: "Taylor Swift", genre: "Pop", rating: 4.8, match: 93, image: "bg-gradient-to-br from-purple-600 to-pink-600" },
  { id: 6, title: "Running Up That Hill", artist: "Chromatics", genre: "Synthwave", rating: 4.9, match: 95, image: "bg-gradient-to-br from-red-600 to-purple-800" },
];

export default function Recommendations() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Smart Recommendations</h1>
          <p className="text-muted-foreground">Curated picks based on your recent activity and preferences.</p>
        </div>

        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="mb-8 bg-background/50 p-1 border border-border/50">
            <TabsTrigger value="movies" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Film className="h-4 w-4"/> Movies & TV</TabsTrigger>
            <TabsTrigger value="books" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><BookOpen className="h-4 w-4"/> Books</TabsTrigger>
            <TabsTrigger value="music" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Music className="h-4 w-4"/> Music</TabsTrigger>
          </TabsList>
          
          <TabsContent value="movies" className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {movies.map((item) => (
                 <div key={item.id} className="group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2">
                   <div className={`absolute inset-0 ${item.image} opacity-80 group-hover:opacity-100 transition-opacity`} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                   
                   <div className="absolute top-3 right-3">
                     <Badge className="bg-primary text-primary-foreground hover:bg-primary font-mono text-xs border-0">
                       {item.match}% Match
                     </Badge>
                   </div>
                   
                   <div className="absolute bottom-0 left-0 p-4 w-full">
                     <h3 className="font-display font-bold text-lg leading-tight text-white mb-1">{item.title}</h3>
                     <p className="text-sm text-gray-300 mb-2">{item.genre}</p>
                     <div className="flex items-center gap-1 text-yellow-400">
                       <Star className="h-3 w-3 fill-current" />
                       <span className="text-xs font-medium">{item.rating}</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </TabsContent>
          
          <TabsContent value="books" className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {books.map((item) => (
                 <div key={item.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-2">
                   <div className={`absolute inset-0 ${item.image} opacity-80 group-hover:opacity-100 transition-opacity`} />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                   
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <h3 className="font-serif font-bold text-xl text-white drop-shadow-md mb-2">{item.title}</h3>
                      <p className="text-sm text-white/90 drop-shadow-md">by {item.author}</p>
                   </div>
                   
                   <div className="absolute bottom-3 right-3">
                     <Badge variant="secondary" className="font-mono text-xs">
                       {item.match}% Match
                     </Badge>
                   </div>
                 </div>
               ))}
             </div>
          </TabsContent>
          
          <TabsContent value="music" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {music.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <div className={`absolute inset-0 ${item.image} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <Music className="h-12 w-12 text-white/80 relative z-10" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent z-20">
                    <h3 className="font-display font-bold text-sm leading-tight text-white truncate">{item.title}</h3>
                    <p className="text-xs text-gray-300 truncate">{item.artist}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-yellow-400 font-medium flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-current" /> {item.rating}
                      </span>
                      <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                        {item.match}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
