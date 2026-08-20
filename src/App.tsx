import { useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLenis } from "./hooks/useLenis";
import { useKonamiCode } from "./hooks/useKonamiCode";
import { useTypedCode } from "./hooks/useTypedCode";

import LoadingScreen from "./components/LoadingScreen";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AnnouncementBar from "./components/AnnouncementBar";
import UpcomingGames from "./components/UpcomingGames";
import SetupShowcase from "./components/SetupShowcase";
import GamesLibrary from "./components/GamesLibrary";
import Menu from "./components/Menu";
import BuildYourDreamPC from "./components/BuildYourDreamPC";
import Stats from "./components/Stats";
import WhyChooseUs from "./components/WhyChooseUs";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import EasterEggOverlay from "./components/EasterEggOverlay";
import AdminPanel from "./pages/AdminPanel";
import { useSettings } from "./hooks/useTaxonomy";

function MainSite({
  loaded,
  setLoaded,
}: {
  loaded: boolean;
  setLoaded: (v: boolean) => void;
}) {
  const settings = useSettings();
  const announcementText = settings.announcementText.trim();

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />
      {loaded && (
        <>
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
            {announcementText && <AnnouncementBar text={announcementText} />}
            <UpcomingGames />
            <GamesLibrary />
            <Menu />
            <SetupShowcase />
            <BuildYourDreamPC />
            <Stats />
            <WhyChooseUs />
            <Gallery />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [rgbMode, setRgbMode] = useState(false);
  const [egg, setEgg] = useState<{ active: boolean; label: string }>({ active: false, label: "" });

  useLenis();

  const triggerGodMode = useCallback(() => {
    setRgbMode(true);
    setEgg({ active: true, label: "GOD MODE ACTIVATED" });
    setTimeout(() => setEgg((e) => ({ ...e, active: false })), 1500);
  }, []);

  const triggerIddqd = useCallback(() => {
    setEgg({ active: true, label: "RGB MODE" });
    document.documentElement.classList.toggle("rgb-mode-flash");
    setTimeout(() => setEgg((e) => ({ ...e, active: false })), 1000);
  }, []);

  useKonamiCode(triggerGodMode);
  useTypedCode("iddqd", triggerIddqd);

  return (
    <div className={rgbMode ? "hue-rotate-animation" : ""}>
      <Routes>
        <Route path="/" element={<MainSite loaded={loaded} setLoaded={setLoaded} />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <EasterEggOverlay active={egg.active} label={egg.label} />
    </div>
  );
}
