# API Web Ujian - Dokumentasi Penggunaan

## 📖 Overview

API untuk sistem ujian online yang dibangun dengan Node.js, Express, dan Prisma. Mendukung manajemen ujian, soal, dan hasil ujian siswa.

## 🚀 Setup dan Instalasi

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm atau yarn

### Instalasi

```bash
# Clone repository (jika ada)
git clone <repository-url>
cd api-web-ujian-2

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan DATABASE_URL yang benar
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Opsional) Seed database
npx prisma db seed
```

### Menjalankan Server

```bash
# Development mode
npx tsx index.ts

# Server akan berjalan di http://localhost:3005
```

## 🔧 Environment Variables

Buat file `.env` di root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
PORT=3005
```

## 📋 API Endpoints

### Base URL

```
http://localhost:3005
```

---

## 📚 Exams (Ujian)

### GET /exams

Mengambil semua data ujian.

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "title": "Ujian Matematika Semester 1",
    "description": "Ujian akhir semester",
    "code": "MTK001",
    "duration": 90,
    "startTime": "2024-01-15T08:00:00.000Z",
    "endTime": "2024-01-15T10:00:00.000Z",
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00.000Z"
  }
]
```

### GET /exams/:id

Mengambil detail ujian berdasarkan ID.

**Parameters:**

- `id` (path): UUID ujian

**Response (200 OK):**

```json
{
  "id": "uuid",
  "title": "Ujian Matematika Semester 1",
  "description": "Ujian akhir semester",
  "code": "MTK001",
  "duration": 90,
  "startTime": "2024-01-15T08:00:00.000Z",
  "endTime": "2024-01-15T10:00:00.000Z",
  "isActive": true,
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

**Error (404):**

```json
{
  "error": "Exam not found"
}
```

### GET /exams?code={code}

Mengambil ujian berdasarkan kode (untuk student join).

**Query Parameters:**

- `code`: Kode ujian (string)

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "title": "Ujian Matematika Semester 1",
    "description": "Ujian akhir semester",
    "code": "MTK001",
    "duration": 90,
    "startTime": "2024-01-15T08:00:00.000Z",
    "endTime": "2024-01-15T10:00:00.000Z",
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00.000Z"
  }
]
```

### POST /exams

Membuat ujian baru.

**Request Body:**

```json
{
  "title": "Ujian Matematika Semester 1",
  "description": "Ujian akhir semester untuk mata pelajaran Matematika kelas 10",
  "code": "MTK001",
  "duration": 90,
  "startTime": "2024-01-15T08:00:00",
  "endTime": "2024-01-15T10:00:00",
  "isActive": true
}
```

**Response (201 Created):**

```json
{
  "id": "generated-uuid",
  "title": "Ujian Matematika Semester 1",
  "description": "Ujian akhir semester untuk mata pelajaran Matematika kelas 10",
  "code": "MTK001",
  "duration": 90,
  "startTime": "2024-01-15T08:00:00.000Z",
  "endTime": "2024-01-15T10:00:00.000Z",
  "isActive": true,
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

**Error (400):**

```json
{
  "error": "Missing required fields"
}
```

**Error (409):**

```json
{
  "error": "Exam code already exists"
}
```

### PUT /exams/:id

Memperbarui data ujian.

**Parameters:**

- `id` (path): UUID ujian

**Request Body (partial update):**

```json
{
  "title": "Ujian Matematika Semester 1 (Updated)",
  "isActive": false
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "title": "Ujian Matematika Semester 1 (Updated)",
  "description": "Ujian akhir semester",
  "code": "MTK001",
  "duration": 90,
  "startTime": "2024-01-15T08:00:00.000Z",
  "endTime": "2024-01-15T10:00:00.000Z",
  "isActive": false,
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

### DELETE /exams/:id

Menghapus ujian.

**Parameters:**

- `id` (path): UUID ujian

**Response (200 OK):**

```json
{
  "message": "Exam deleted successfully"
}
```

---

## ❓ Questions (Soal)

### GET /questions?examId={examId}

Mengambil semua soal untuk ujian tertentu.

**Query Parameters:**

- `examId`: UUID ujian (string)

**Response (200 OK):**

```json
[
  {
    "id": "q1",
    "examId": "exam-uuid",
    "type": "MULTIPLE_CHOICE",
    "text": "Berapakah hasil dari 2 + 2?",
    "points": 10,
    "imageUrl": null,
    "correctAnswer": null,
    "sampleAnswer": null,
    "keywords": [],
    "difficulty": "EASY",
    "tags": ["matematika"],
    "questionBankId": null,
    "isFromBank": false,
    "options": [
      {
        "id": "opt1",
        "text": "3",
        "isCorrect": false
      },
      {
        "id": "opt2",
        "text": "4",
        "isCorrect": true
      }
    ]
  }
]
```

### GET /questions/:id

Mengambil detail soal berdasarkan ID.

**Parameters:**

- `id` (path): UUID soal

**Response (200 OK):**

```json
{
  "id": "q1",
  "examId": "exam-uuid",
  "type": "MULTIPLE_CHOICE",
  "text": "Berapakah hasil dari 2 + 2?",
  "points": 10,
  "options": [...]
}
```

### POST /questions

Membuat soal baru.

**Request Body (Multiple Choice):**

```json
{
  "examId": "exam-uuid",
  "type": "MULTIPLE_CHOICE",
  "text": "Berapakah hasil dari 2 + 2?",
  "points": 10,
  "options": [
    {
      "text": "3",
      "isCorrect": false
    },
    {
      "text": "4",
      "isCorrect": true
    }
  ]
}
```

**Request Body (Short Answer):**

```json
{
  "examId": "exam-uuid",
  "type": "SHORT_ANSWER",
  "text": "Sebutkan rumus luas lingkaran",
  "points": 15,
  "correctAnswer": "πr²"
}
```

**Request Body (Essay):**

```json
{
  "examId": "exam-uuid",
  "type": "ESSAY",
  "text": "Jelaskan konsep aljabar linear",
  "points": 20
}
```

**Response (201 Created):**

```json
{
  "id": "generated-uuid",
  "examId": "exam-uuid",
  "type": "MULTIPLE_CHOICE",
  "text": "Berapakah hasil dari 2 + 2?",
  "points": 10,
  "options": [...]
}
```

### PUT /questions/:id

Memperbarui soal.

**Parameters:**

- `id` (path): UUID soal

**Request Body:**

```json
{
  "text": "Updated question text",
  "points": 15,
  "options": [
    {
      "text": "Updated option",
      "isCorrect": true
    }
  ]
}
```

### DELETE /questions/:id

Menghapus soal.

**Parameters:**

- `id` (path): UUID soal

**Response (200 OK):**

```json
{
  "message": "Question deleted successfully"
}
```

---

## 📊 Results (Hasil Ujian)

### GET /results?examId={examId}

Mengambil semua hasil ujian untuk ujian tertentu.

**Query Parameters:**

- `examId`: UUID ujian (string)

**Response (200 OK):**

```json
[
  {
    "id": "r1",
    "examId": "exam-uuid",
    "studentName": "John Doe",
    "score": 85.0,
    "correctCount": 8,
    "totalQuestions": 10,
    "gradingStatus": "AUTO_GRADED",
    "submittedAt": "2024-01-15T09:30:00.000Z",
    "answers": [
      {
        "id": "ans1",
        "questionId": "q1",
        "answer": "b",
        "manualGrade": null,
        "feedback": null,
        "gradingStatus": "GRADED"
      }
    ]
  }
]
```

### GET /results/:id

Mengambil detail hasil ujian berdasarkan ID.

**Parameters:**

- `id` (path): UUID hasil

### POST /results

Menyimpan hasil ujian siswa.

**Request Body:**

```json
{
  "examId": "exam-uuid",
  "studentName": "John Doe",
  "score": 85,
  "correctCount": 8,
  "totalQuestions": 10,
  "answers": [
    {
      "questionId": "q1",
      "answer": "b",
      "manualGrade": null,
      "feedback": null,
      "gradingStatus": "GRADED"
    }
  ]
}
```

### PATCH /results/:id

Memperbarui nilai manual untuk hasil ujian (untuk admin grading).

**Parameters:**

- `id` (path): UUID hasil

**Request Body:**

```json
{
  "manualGrades": {
    "q1": 10,
    "q2": 15
  },
  "score": 95,
  "gradingStatus": "GRADED"
}
```

### DELETE /results/:id

Menghapus hasil ujian siswa.

**Parameters:**

- `id` (path): UUID hasil

---

## 🧪 Testing dengan Postman

### 1. Setup Environment

- Buat environment baru di Postman
- Set variable `base_url` = `http://localhost:3000`

### 2. Contoh Collection

```json
{
  "info": {
    "name": "API Web Ujian"
  },
  "item": [
    {
      "name": "Create Exam",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Ujian Matematika\",\n  \"description\": \"Ujian akhir semester\",\n  \"code\": \"MTK001\",\n  \"duration\": 90,\n  \"startTime\": \"2024-01-15T08:00:00\",\n  \"endTime\": \"2024-01-15T10:00:00\",\n  \"isActive\": true\n}"
        },
        "url": {
          "raw": "{{base_url}}/exams",
          "host": ["{{base_url}}"],
          "path": ["exams"]
        }
      }
    }
  ]
}
```

## 🚨 Error Codes

| Code | Description                  |
| ---- | ---------------------------- |
| 200  | OK                           |
| 201  | Created                      |
| 400  | Bad Request (missing fields) |
| 404  | Not Found                    |
| 409  | Conflict (duplicate code)    |
| 500  | Internal Server Error        |

## 📝 Notes

- Semua datetime menggunakan format ISO 8601
- UUID digunakan untuk semua ID
- Field yang optional ditandai dengan `?`
- Untuk multiple choice questions, sertakan array `options`
- Pastikan `examId` valid sebelum membuat questions/results

## 🔍 Troubleshooting

### Database Connection Issues

```bash
# Check database connection
npx prisma db push --preview-feature

# Reset database
npx prisma migrate reset --force
```

### Common Errors

- **"Exam not found"**: Pastikan ID ujian benar
- **"Missing required fields"**: Periksa request body
- **"Exam code already exists"**: Gunakan kode unik

---

_Dokumentasi ini dibuat untuk API Web Ujian v1.0.0_
