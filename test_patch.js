
async function testPatch() {
  const cx = await fetch('http://localhost:3005/results/33f99058-f68e-4aea-86e9-9c294b194c2b', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      manualGrades: { "calc-5": 20 },
      score: 60,
      gradingStatus: "graded"
    })
  });
  
  console.log("Status:", cx.status);
  const json = await cx.json();
  console.log("Response:", JSON.stringify(json, null, 2));
}

testPatch();
