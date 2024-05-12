import NavBar from "../components/NavBar";
import VeranstaltungenTable from '../components/VeranstaltungenTable'

export default function HomePage() {
    return (
      <div>
        <NavBar/>
        <h1>Meine Veranstaltungen</h1>
        <VeranstaltungenTable/>
      </div>
    );
}