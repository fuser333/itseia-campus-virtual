import SemanaView from "../_components/SemanaView";
import { getWeek } from "../_data/ignite";

export default function DemoSemana2() {
  return <SemanaView week={getWeek(2)} />;
}
