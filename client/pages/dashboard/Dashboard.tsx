import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { 
  DollarSign, 
  Users, 
  Disc, 
  Music, 
  Download, 
  UserCheck, 
  UserPlus, 
  Radio 
} from "lucide-react";

const metrics = [
  { icon: DollarSign, value: "$950m", label: "Revenue generated" },
  { icon: Users, value: "500", label: "Total Artists" },
  { icon: Disc, value: "874k", label: "Total Albums" },
  { icon: Music, value: "12,500k", label: "Total Songs" },
  { icon: Download, value: "8,325k", label: "Total Downloads" },
  { icon: UserCheck, value: "1050k", label: "Number of active users" },
  { icon: UserPlus, value: "50", label: "New user signups" },
  { icon: Radio, value: "9,950m", label: "Number of songs streamed" },
];

const topArtists = [
  { no: 1, name: "Wizkid", streams: "526,925 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/c44eead90f6e37874571ded3d4df5295699a225c?width=74" },
  { no: 2, name: "BurnaBoy", streams: "453,537 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/7de595f9863e192b0f04217263924897c2ff45ce?width=70" },
  { no: 3, name: "Ice Prince", streams: "390,150 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/41fee7ffe9b510fde5bbafb3aef841155702a282?width=82" },
  { no: 4, name: "Davido", streams: "336,762 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/56671683fcd5fd3c2a72d29d20962242fcfa89ab?width=70" },
  { no: 5, name: "Olamide", streams: "293,375 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/c180be1a0238e857ca0e81e1b866cf876b1ea1a0?width=70" },
  { no: 6, name: "Johnny Drill", streams: "259,987 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/fc4c67d81dea480528ae2b945065062221cdc982?width=194" },
  { no: 7, name: "Rema", streams: "236,600 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/ed6d461dbdf2157aea8eb791d71ce17debbe1bfa?width=110" },
  { no: 8, name: "Asa", streams: "213,212 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/1aaf352932d7ae1dec050150d1885f8bd861c13b?width=70" },
  { no: 9, name: "Tems", streams: "199,825 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/94d30b33fab743967c3f97b3b7589b86512f38fa?width=75" },
  { no: 10, name: "Rema", streams: "186,437 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/ed6d461dbdf2157aea8eb791d71ce17debbe1bfa?width=110", faded: true },
];

const topSongs = [
  { no: 1, name: "2 Sugar ft Ayra Starr  - Wiz...", streams: "526,925 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=106" },
  { no: 2, name: "Bad To Me - Wizkid", streams: "453,537 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=106" },
  { no: 3, name: "Special (feat. Don Toliver)", streams: "390,150 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=106" },
  { no: 4, name: "Fever - Wizkid", streams: "336,762 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/1605022505ace4630badc55cb4828c349687453c?width=90" },
  { no: 5, name: "Big 7 - Burnaboy", streams: "293,375 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/1c8a21ae0d3e24d07b4236e2574054ef5f863f71?width=90" },
  { no: 6, name: "Kwaku the Traveller", streams: "259,987 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/556c5905bd0e935cdbc73e25f503c587b7c5a7af?width=64" },
  { no: 7, name: "Big Girls Cry -  Sia", streams: "236,600 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/3387ff42d2f75d750b650c48d3220f6b1ed885e3?width=64" },
  { no: 8, name: "Missing U - Badwiz", streams: "213,212 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/f9d27803b8ac1f39044ee27e7ec4b7dd32dc36d8?width=90" },
  { no: 9, name: "Molting - Sion", streams: "199,825 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/e6320e49285464560325ab2f13072f2ffba4aafc?width=90" },
  { no: 10, name: "Lie to me - Sion", streams: "186,437 streams", image: "https://api.builder.io/api/v1/image/assets/TEMP/cfd740bf75ef80159832dcd286f4464a7d968839?width=90" },
];

export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-[30px] lg:gap-y-4 mb-8 lg:mb-12">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={index}
            icon={metric.icon}
            value={metric.value}
            label={metric.label}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-[89px] mt-8">
        <div className="overflow-x-auto">
          <h2 className="text-white text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Top 10 artists</h2>
          <div className="rounded-lg bg-asra-gray-1 shadow-[0_1px_3px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.06)] min-w-[500px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-asra-gray-5">
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-center">No.</th>
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-left">NAME OF ARTIST</th>
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-center">MONTHLY LISTENERS</th>
                </tr>
              </thead>
              <tbody>
                {topArtists.map((artist, index) => (
                  <tr key={index} className={`border-b border-asra-gray-5 ${index % 2 === 0 ? 'bg-asra-gray-1' : 'bg-transparent'}`}>
                    <td className="text-white text-sm px-4 lg:px-6 py-3 lg:py-4 text-center">{artist.no}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center gap-3">
                        <img src={artist.image} alt={artist.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        <span className="text-white text-sm">{artist.name}</span>
                      </div>
                    </td>
                    <td className={`text-sm px-4 lg:px-6 py-3 lg:py-4 text-center ${artist.faded ? 'text-asra-gray-5' : 'text-white'}`}>
                      {artist.streams}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h2 className="text-white text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Top 10 Songs</h2>
          <div className="rounded-lg bg-asra-gray-1 border border-asra-gray-5 shadow-[0_1px_3px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.06)] min-w-[500px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-asra-gray-5">
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-center">No.</th>
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-left">NAME OF SONG</th>
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-center">MONTHLY LISTENERS</th>
                </tr>
              </thead>
              <tbody>
                {topSongs.map((song, index) => (
                  <tr key={index} className={`border-b border-asra-gray-5 ${index % 2 === 0 ? 'bg-asra-gray-1' : 'bg-transparent'}`}>
                    <td className="text-white text-sm px-4 lg:px-6 py-3 lg:py-4 text-center">{song.no}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center gap-3">
                        <img src={song.image} alt={song.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        <span className="text-white text-sm">{song.name}</span>
                      </div>
                    </td>
                    <td className="text-white text-sm px-4 lg:px-6 py-3 lg:py-4 text-center">{song.streams}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
