import "./App.css";
import CriticalMails from "./components/emails/CriticalMails";
import TauxClotureG from "./components/taux_cloture/TauxClotureG";
import Navbar from "./components/Navbar";
import DashboardSection from "./components/DashboardSection";

function App() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="flex mx-20">
        <DashboardSection>
          <TauxClotureG />
        </DashboardSection>
      </main>
      <CriticalMails />
    </div>
  );
}

export default App;
