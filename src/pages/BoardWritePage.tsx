import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

function BoardWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력하세요");
      return;
    }

    const formData = new FormData();
    formData.append("boardTitle", title);
    formData.append("boardContents", content);
    if (file) formData.append("boardFile", file);

    try {
      setLoading(true);

      await client.post("/api/board/save", formData, {
        withCredentials: true,
      });

      alert("글 작성 완료!");
      navigate("/board");
    } catch (e) {
      console.error(e);
      alert("작성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">글쓰기</h2>

        {/* 제목 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">제목</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">내용</label>
          <textarea
            rows={6}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 파일 */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">파일 업로드</label>

          <label className="cursor-pointer inline-block px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            파일 선택
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {file && (
            <p className="mt-2 text-sm text-gray-600">선택됨: {file.name}</p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/board")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "작성 중..." : "글 작성"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardWritePage;
