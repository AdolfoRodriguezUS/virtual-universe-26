window.WALK = {
  skills: {
    steps: [
      {
        h: "Ask Copilot to open the skill",
        body: [
          "Read only. Open .github/skills/issue-to-pr/SKILL.md from this checkout in the editor.",
          { k: "chat", text: "Read only. Open .github/skills/issue-to-pr/SKILL.md from this checkout in the editor." },
        ],
      },
      {
        h: "Ready to make changes?",
        body: [
          "Keep the current checkout and preserve origin. Do not open another session or clone a separate checkout just to read the skill.",
          "The same checkout is the safe place to make one useful edit.",
          { k: "chat", text: "Open the .github/skills/issue-to-pr/SKILL.md skill file in this checkout and make one useful edit without creating a fork." },
        ],
      },
      {
        h: "Make one useful edit",
        body: [
          "Edit the existing skill file in place and save it.",
          "Keep the repo, current branch, and working tree intact. No fork is needed before a change is ready to publish.",
        ],
      },
    ],
  },
  tools: {
    steps: [
      {
        h: "Add the suggested connector",
        body: [
          "No fork is needed to read or try the public docs connector.",
          { k: "chat", text: "Use the public Microsoft Learn connector to look up current Node.js documentation without creating a fork." },
          {
            link: {
              href: "ghapp://mcp/install?" + encodeURIComponent(JSON.stringify({
                name: "microsoft-learn",
                type: "http",
                url: "https://learn.microsoft.com/api/mcp",
              })),
              text: "Add Microsoft Learn",
            },
          },
        ],
      },
    ],
  },
  security: {
    steps: [
      {
        h: "Review the result",
        body: [
          { k: "chat", text: "Review the current change for security issues without creating a fork." },
        ],
      },
    ],
  },
  automate: {
    steps: [
      {
        h: "Create the automation",
        body: [
          { k: "chat", text: "Create a manual automation for this repo without creating a fork." },
        ],
      },
    ],
  },
};
