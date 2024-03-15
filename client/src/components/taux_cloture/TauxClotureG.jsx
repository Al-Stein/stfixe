import {
  Category,
  ChartComponent,
  Inject,
  Legend,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  DataLabel,
  Zoom,
} from "@syncfusion/ej2-react-charts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TauxClotureG() {
  const [cloture, setClouture] = useState([]);
  const [ouverture, setOuverture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCloture, resOuverture] = await Promise.all([
          axios.get("http://localhost:3005/taux-cloture"),
          axios.get("http://localhost:3005/taux-ouverture"),
        ]);
        setClouture(resCloture.data);
        setOuverture(resOuverture.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const primaryxAxis = {
    valueType: "Category",
    title: "Weeks",
    minimum: cloture.length - 10,
    maximum: cloture.length - 1,
  };
  const palette = ["#660708", "#008000"];

  return (
    <ChartComponent
      id="taux-cloture-chart"
      title="Taux Cloture"
      primaryXAxis={primaryxAxis}
      palettes={palette}
      zoomSettings={{ enableSelectionZooming: true }}
    >
      <Inject services={[Legend, LineSeries, Category, DataLabel, Zoom]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={cloture}
          xName="_id"
          yName="some"
          name="Cloture"
          marker={{ dataLabel: { visible: true }, visible: true }}
        />
        <SeriesDirective
          dataSource={ouverture}
          xName="_id"
          yName="some"
          name="Ouverture"
          marker={{ dataLabel: { visible: true }, visible: true }}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
}
