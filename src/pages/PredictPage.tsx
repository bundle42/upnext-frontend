import { useState } from "react";
import client from "../api/client";
import VisualizationPage from "./VisualizationPage";

function PredictPage() {
  const [selectedStock, setSelectedStock] = useState("삼성전자");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const stocks = ["삼성전자", "SK하이닉스", "현대차"];

  const handlePredict = () => {
    if (!selectedStock) return;

    setLoading(true);
    setPrediction(null);

    client
      .get(`/api/predict?stockName=${encodeURIComponent(selectedStock)}`)
      .then((res) => {
        setPrediction(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const result = prediction?.lstm_result;
  const next = result?.next_prediction;
  const history = result?.historical_predictions || [];

  // 🔥 방향 정확도 계산
  const total = history.length;
  const correct = history.filter((h: any) => h.direction_match).length;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* 종목 선택 */}
        <div className="flex gap-3">
          {stocks.map((stock) => (
            <button
              key={stock}
              onClick={() => {
                setSelectedStock(stock);
                setPrediction(null);
              }}
              className={`px-4 py-2 rounded-lg border transition ${
                selectedStock === stock
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {stock}
            </button>
          ))}
        </div>

        {/* 예측 버튼 */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              📈 {selectedStock} 주가 예측
            </h3>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              {loading ? "예측 중..." : "예측하기"}
            </button>
          </div>

          {!prediction && !loading && (
            <p className="text-gray-400 mt-4">
              종목을 선택하고 예측 버튼을 눌러주세요
            </p>
          )}

          {loading && (
            <p className="text-gray-400 mt-4">
              🔄 데이터를 불러오는 중입니다...
            </p>
          )}
        </div>

        {/* 결과 */}
        {prediction && result && next && (
          <>
            {/* 핵심 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow text-center">
                <h4 className="text-gray-500 text-sm">다음 날 예측 종가</h4>
                <p className="text-xl font-bold">
                  {next.predicted_next_close.toLocaleString()}원
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow text-center">
                <h4 className="text-gray-500 text-sm">등락폭</h4>
                <p
                  className={`text-xl font-bold ${
                    next.predicted_change < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {next.predicted_change.toLocaleString()}원
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow text-center">
                <h4 className="text-gray-500 text-sm">등락률</h4>
                <p
                  className={`text-xl font-bold ${
                    next.predicted_change_pct < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {next.predicted_change_pct.toFixed(2)}%
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow text-center">
                <h4 className="text-gray-500 text-sm">방향</h4>
                <p className="text-xl font-bold">{next.direction}</p>
                {accuracy && (
                  <p className="text-sm text-gray-400 mt-1">
                    신뢰도: {accuracy}%
                  </p>
                )}
              </div>
            </div>

            {/* 모델 요약 (🔥 추가) */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3">📊 모델 요약</h3>
              <div className="text-gray-600 space-y-1">
                <p>최근 방향 정확도: {accuracy}%</p>
                <p>총 평가 데이터: {total}개</p>
              </div>
            </div>

            {/* 모델 정보 */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3">🤖 모델 정보</h3>
              <div className="text-gray-600 space-y-1">
                <p>시퀀스 길이: {result.sequence_length}</p>
                <p>RMSE: {result.validation_metrics.rmse.toFixed(2)}</p>
                <p>MAE: {result.validation_metrics.mae.toFixed(2)}</p>
              </div>
            </div>

            {/* Feature */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3">📌 사용된 Feature</h3>
              <div className="flex flex-wrap gap-2">
                {result.feature_cols.map((f: string) => (
                  <span
                    key={f}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    #{f}
                  </span>
                ))}
              </div>
            </div>

            {/* 히스토리 */}
            <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
              <h3 className="font-semibold mb-3">📊 과거 예측 결과</h3>

              <table className="w-full text-sm text-center">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-2">날짜</th>
                    <th className="p-2">실제</th>
                    <th className="p-2">예측</th>
                    <th className="p-2">실제 방향</th>
                    <th className="p-2">예측 방향</th>
                    <th className="p-2">적중</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item: any, idx: number) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">
                        {item.actual_target_close.toLocaleString()}
                      </td>
                      <td className="p-2">
                        {item.predicted_target_close.toLocaleString()}
                      </td>
                      <td className="p-2">{item.actual_direction}</td>
                      <td className="p-2">{item.predicted_direction}</td>
                      <td className="p-2">
                        {item.direction_match ? "✅" : "❌"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <VisualizationPage prediction={prediction} />
          </>
        )}
      </div>
    </div>
  );
}

export default PredictPage;
