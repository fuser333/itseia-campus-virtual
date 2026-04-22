import SemanaView from "../_components/SemanaView";
import { getWeek } from "../_data/ignite";

export default function DemoSemana1() {
  return <SemanaView week={getWeek(1)} />;
}
