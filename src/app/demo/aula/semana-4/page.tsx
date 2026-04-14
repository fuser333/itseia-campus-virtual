import SemanaView from "../_components/SemanaView";
import { getWeek } from "../_data/ignite";

export default function DemoSemana4() {
  return <SemanaView week={getWeek(4)} />;
}
