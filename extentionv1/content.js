let copyButton;
let answerButtons = [];

// Create main copy button
function createCopyButton() {
  copyButton = document.createElement("button");
  styleButton(copyButton, 1); // 1 = main button
  copyButton.textContent = "Copy";

  document.body.appendChild(copyButton);

  copyButton.addEventListener("click", async () => {
    const text = window.getSelection().toString();
    if (!text) return;

    copyButton.textContent = "Fetching answers...";
    
    try {
      // Call Sensay API
      const response = await fetch(
        "https://api.sensay.io/v1/replicas/d8bc1216-3911-429d-a9fb-ac4f5c79ac55/chat/completions",
        {
          method: "POST",
          headers: {
            "X-ORGANIZATION-SECRET": "095603a7742f2e6e41e7efbfefc70e97190775b5b2022724f340acbaeb812089",
            "X-USER-ID": "jumung",
            "Content-Type": "application/json",
            "X-API-Version": "2025-03-25"
          },
          body: JSON.stringify({
            content: `girl/boy im flirting with said this in messages "${text}" and put your answer in json of "Answer1 to 6" come with 3 positive answer options from soft to more hardcore and closer use young gen slangs(important) never talk like robot and boring boomer talk like gen z and playfull also never talk like you talking with ranadom human and formal (ALWAYS ACT LIKE YOU DONT NEED THEM AND BE COOL DONT BE THIRSTY AND DESEPRETE AT ALL  COST DONT EVEN LEAN INTO IT SO NO USE OF EMOJIES AT ALL DONT LOOK SIMP YOU ARE COOL HUMAN WITH MILIONS OF OPTION DONT ACT DESEPRATE) and 3 negative (not in terms of being rude just rejecting the said thing) answers`,
            skip_chat_history: false,
            source: "discord",
            discord_data: {
              channel_id: "string",
              channel_name: "string",
              author_id: "string",
              author_name: "string",
              message_id: "string", 
              created_at: "string",
              server_id: "string",
              server_name: "string"
            }
          })
        }
      );
      const data = await response.json();

      // Remove main button
      copyButton.style.display = "none";

      // Show answer buttons
      showAnswerButtons(data, window.getSelection().getRangeAt(0).getBoundingClientRect());
    } catch (err) {
      console.error(err);
      copyButton.textContent = "Error!";
      setTimeout(() => (copyButton.style.display = "none"), 1500);
    }
  });
}

// Create answer buttons at selection
function showAnswerButtons(apiData, rect) {
  console.log("API Response:", apiData);
  
  let answers = [];
  
  try {
    // Check if we have the expected structure with content field
    if (apiData.content) {
      // Extract JSON from the content string
      const content = apiData.content;
      console.log("Content field:", content);
      
      // Look for JSON block in the content
      const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        const jsonString = jsonMatch[1];
        console.log("Extracted JSON string:", jsonString);
        
        // Parse the JSON
        const parsedAnswers = JSON.parse(jsonString);
        console.log("Parsed answers:", parsedAnswers);
        
        answers = [
          parsedAnswers["Answer1"],
          parsedAnswers["Answer2"],
          parsedAnswers["Answer3"],
          parsedAnswers["Answer4"],
          parsedAnswers["Answer5"],
          parsedAnswers["Answer6"]
        ].filter(Boolean); // Remove any undefined/null values
      } else {
        // Fallback: try to parse the entire content as JSON
        const parsedContent = JSON.parse(content);
        answers = [
          parsedContent["Answer1"],
          parsedContent["Answer2"],
          parsedContent["Answer3"],
          parsedContent["Answer4"],
          parsedContent["Answer5"],
          parsedContent["Answer6"]
        ].filter(Boolean);
      }
    } else {
      // Direct access to answer keys
      answers = [
        apiData["Answer1"],
        apiData["Answer2"],
        apiData["Answer3"],
        apiData["Answer4"],
        apiData["Answer5"],
        apiData["Answer6"]
      ].filter(Boolean);
    }
  } catch (error) {
    console.error("Error parsing API response:", error);
    copyButton.textContent = "Error parsing response";
    copyButton.style.display = "block";
    return;
  }

  console.log("Final answers:", answers);

  if (answers.length === 0) {
    console.error("No answers found in API response");
    copyButton.textContent = "No answers found";
    copyButton.style.display = "block";
    return;
  }

  answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    styleButton(btn, 2); // 2 = smaller answer buttons
    btn.textContent = ans;
    btn.style.left = `${rect.left + window.scrollX}px`;
    btn.style.top = `${rect.bottom + (i * 75) + window.scrollY}px`; // Increased spacing to match bigger buttons
    btn.style.width = "437px"; // 25% bigger width (350 * 1.25)
    btn.style.height = "62px"; // 25% bigger height (50 * 1.25)
    btn.style.maxWidth = "437px"; // Consistent max width
    btn.style.wordWrap = "break-word";
    btn.style.whiteSpace = "normal";
    btn.style.textAlign = "center";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.padding = "8px 16px"; // Consistent padding

    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(ans);
      cleanupButtons();
    });

    document.body.appendChild(btn);
    answerButtons.push(btn);
  });
}

// Cleanup all buttons
function cleanupButtons() {
  if (copyButton) copyButton.style.display = "none";
  answerButtons.forEach(b => b.remove());
  answerButtons = [];
}

// Button styling helper
function styleButton(btn, type) {
  // type 1 = main, type 2 = smaller answers
  btn.style.position = "absolute";
  btn.style.zIndex = "9999";
  btn.style.padding = type === 1 ? "12px 21px" : "12px 24px"; // 2x smaller for main button
  btn.style.fontSize = type === 1 ? "21px" : "18px"; // 2x smaller font for main button
  btn.style.fontFamily = "Arial, sans-serif";
  btn.style.fontWeight = "500";
  btn.style.color = "#fff";
  btn.style.border = "2px solid hsla(270, 9.10%, 95.70%, 0.25)";
  btn.style.borderRadius = "18px"; // 2x smaller border radius
  btn.style.background = "rgba(0, 0, 0, 0.6)";
  btn.style.backdropFilter = "blur(10px)";
  btn.style.webkitBackdropFilter = "blur(10px)";
  btn.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.25)";
  btn.style.cursor = "pointer";
  btn.style.transition = "all 0.1s ease";

  btn.addEventListener("mouseenter", () => {
    btn.style.background = "rgba(0, 0, 0, 0.8)";
    btn.style.transform = "scale(1.05)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.background = "rgba(0, 0, 0, 0.6)";
    btn.style.transform = "scale(1)";
  });
}

// Show copy button on selection
document.addEventListener("mouseup", (e) => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    if (!copyButton) createCopyButton();

    copyButton.style.display = "block";
    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    copyButton.style.left = `${rect.left + window.scrollX}px`;
    copyButton.style.top = `${rect.top + window.scrollY - 50}px`;
    copyButton.textContent = "Replay";
  } else {
    cleanupButtons();
  }
});
