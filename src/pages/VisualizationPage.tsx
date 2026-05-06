import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  prediction: any;
};

function VisualizationPage({ prediction }: Props) {
  if (!prediction) return null;

  const result = prediction.lstm_result;
  const history = result?.historical_predictions || [];

  const chartHistory = history.map((h: any) => ({
    date: h.date,
    actual: h.actual_target_close,
    predicted: h.predicted_target_close,
  }));

  return (
    <div className="space-y-6">
      {/* 📈 주가 */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-3">📈 주가 추이</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={prediction.prediction_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line dataKey="close" name="종가" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 예측 vs 실제 */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-3">📊 실제 vs 예측</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line dataKey="actual" name="실제" stroke="#8884d8" dot={false} />
            <Line
              dataKey="predicted"
              name="예측"
              stroke="#ff0000"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default VisualizationPage;
