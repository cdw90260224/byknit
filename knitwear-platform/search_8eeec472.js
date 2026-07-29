const fs = require('fs');
const readline = require('readline');

const logFilePath = 'C:\\Users\\CHA\\.gemini\\antigravity\\brain\\8eeec472-8fb9-4997-8fcf-81889da94cf6\\.system_generated\\logs\\transcript.jsonl';

async function main() {
  if (!fs.existsSync(logFilePath)) {
    console.log("Log file not found!");
    return;
  }
  const fileStream = fs.createReadStream(logFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log("=== TRANSCRIPT FOR 8eeec472 ===");
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'USER_INPUT') {
        console.log(`[User: ${parsed.timestamp || ''}]`);
        console.log(parsed.content);
        console.log("-".repeat(40));
      }
    } catch (e) {
      // ignore
    }
  }
}

main();
