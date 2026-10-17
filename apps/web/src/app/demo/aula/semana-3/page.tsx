import SemanaView from "../_components/SemanaView";
import { getWeek } from "../_data/ignite";

export default function DemoSemana3() {
  return <SemanaView week={getWeek(3)} />;
}
