import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Hero from "./pages/Hero";
import Dashboard from "./pages/Dashboard";
import CreateExam from "./pages/CreateExam";
import EditExam from "./pages/EditExam";
import ExamPrintView from "./pages/ExamPrintView";
import EditQuestion from "./pages/EditQuestion";
import ExamResults from "./pages/ExamResults";
import StudentExam from "./pages/student/Exam";
import GradeSubmission from "./pages/GradeSubmission";
import QuestionBank from "./pages/QuestionBank";
import CreateQuestionBank from "./pages/CreateQuestionBank";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/tambah-ujian" element={<CreateExam />} />
        <Route path="/admin/edit-ujian/:id" element={<EditExam />} />
        <Route path="/admin/ujian/:examId/soal" element={<EditQuestion />} />
        <Route path="/admin/ujian/:examId/cetak" element={<ExamPrintView />} />
        <Route path="/admin/ujian/:examId/hasil" element={<ExamResults />} />
        <Route path="/admin/question-bank" element={<QuestionBank />} />
        <Route
          path="/admin/question-bank/create"
          element={<CreateQuestionBank />}
        />
        <Route path="/ujian/:examId" element={<StudentExam />} />
        <Route path="/grade/:examId/:resultId" element={<GradeSubmission />} />
      </Routes>
    </>
  );
}

export default App;
