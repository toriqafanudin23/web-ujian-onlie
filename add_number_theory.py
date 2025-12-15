import json
from datetime import datetime, timedelta

def create_exam_data():
    exam_id = "6"
    now = datetime.now()
    start_time = (now + timedelta(days=7)).replace(hour=8, minute=0, second=0, microsecond=0)
    end_time = start_time + timedelta(minutes=90)
    
    new_exam = {
        "id": exam_id,
        "title": "UTS Teori Bilangan",
        "description": "Evaluasi pemahaman materi keterbagian, FPB, KPK, kekongruenan, dan bilangan prima.",
        "code": "NUMTH01",
        "duration": 90,
        "startTime": start_time.isoformat(),
        "endTime": end_time.isoformat(),
        "isActive": True,
        "createdAt": now.isoformat()
    }

    questions = [
        {
            "id": "num-1",
            "examId": exam_id,
            "type": "multiple_choice",
            "text": "Berapakah Faktor Persekutuan Terbesar (FPB) dari 84 dan 126?",
            "points": 20,
            "difficulty": "easy",
            "options": [
                {"id": "a", "text": "14", "isCorrect": False},
                {"id": "b", "text": "21", "isCorrect": False},
                {"id": "c", "text": "42", "isCorrect": True},
                {"id": "d", "text": "84", "isCorrect": False}
            ]
        },
        {
            "id": "num-2",
            "examId": exam_id,
            "type": "multiple_choice",
            "text": "Manakah di antara bilangan berikut yang merupakan bilangan prima?",
            "points": 20,
            "difficulty": "easy",
            "options": [
                {"id": "a", "text": "51", "isCorrect": False},
                {"id": "b", "text": "91", "isCorrect": False},
                {"id": "c", "text": "97", "isCorrect": True},
                {"id": "d", "text": "119", "isCorrect": False}
            ]
        },
        {
            "id": "num-3",
            "examId": exam_id,
            "type": "multiple_choice",
            "text": "Tentukan sisa pembagian $2^{50}$ oleh 7.",
            "points": 20,
            "difficulty": "hard",
            "options": [
                {"id": "a", "text": "1", "isCorrect": False},
                {"id": "b", "text": "2", "isCorrect": False},
                {"id": "c", "text": "4", "isCorrect": True},
                {"id": "d", "text": "5", "isCorrect": False}
            ]
        },
        {
            "id": "num-4",
            "examId": exam_id,
            "type": "multiple_choice",
            "text": "Solusi dari kongruensi linear $3x \\equiv 4 \\pmod{5}$ adalah...",
            "points": 20,
            "difficulty": "medium",
            "options": [
                {"id": "a", "text": "$x \\equiv 1 \\pmod{5}$", "isCorrect": False},
                {"id": "b", "text": "$x \\equiv 2 \\pmod{5}$", "isCorrect": False},
                {"id": "c", "text": "$x \\equiv 3 \\pmod{5}$", "isCorrect": True},
                {"id": "d", "text": "$x \\equiv 4 \\pmod{5}$", "isCorrect": False}
            ]
        },
        {
            "id": "num-5",
            "examId": exam_id,
            "type": "multiple_choice",
            "text": "Jika suatu bilangan bulat $n$ ganjil, maka $n^2 - 1$ selalu habis dibagi oleh:",
            "points": 20,
            "difficulty": "medium",
            "options": [
                {"id": "a", "text": "4", "isCorrect": False},
                {"id": "b", "text": "6", "isCorrect": False},
                {"id": "c", "text": "8", "isCorrect": True},
                {"id": "d", "text": "12", "isCorrect": False}
            ]
        }
    ]

    return new_exam, questions

def update_db(file_path='db.json'):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        exam, new_questions = create_exam_data()
        
        # Check if exam already exists (to avoid duplicates if run multiple times)
        if hasattr(data, 'get'):
             existing_ids = [e['id'] for e in data.get('exams', [])]
             if exam['id'] not in existing_ids:
                 data['exams'].append(exam)
                 print(f"Added exam: {exam['title']}")
             else:
                 print(f"Exam {exam['id']} already exists, skipping exam addition.")
                 
             # Add questions
             # Simplify: just append, assuming IDs are unique enough or user cleans up
             # But let's check duplicates based on ID
             existing_q_ids = [q['id'] for q in data.get('questions', [])]
             count = 0
             for q in new_questions:
                 if q['id'] not in existing_q_ids:
                     data['questions'].append(q)
                     count += 1
             
             print(f"Added {count} questions.")
             
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print("Database updated successfully!")
        
    except Exception as e:
        print(f"Error updating database: {e}")

if __name__ == "__main__":
    update_db()
